import MockAdapter from "axios-mock-adapter";
import express from "express";
import request from "supertest";

import app from "../../src/app";
import { axiosInstance } from "../../src/utils/axios";
import {
  mailChimpApiKey,
  mailChimpListId,
  mailChimpUrl,
} from "../../src/settings";
import { EmailSignupRequest } from "../../src/types";

const mock = new MockAdapter(axiosInstance);
const initServer = () => {
  const server = express();
  server.use(app);
  return server;
};

describe("Signup Endpoint", () => {
  beforeEach(() => {
    mock.reset();
  });

  it("should return error for missing email", async () => {
    // given
    const call: string = "/api/signup/";

    mock.onAny().abortRequest();
    const server = initServer();

    // when
    const res = await request(server).post(call);

    // then
    expect(mock.history.get.length).toBe(0);
    expect(res.status).toEqual(400);
  });

  it("should return error for bad email", async () => {
    // given
    const call: string = "/api/signup/";

    mock.onAny().abortRequest();
    const server = initServer();

    // when
    const res = await request(server)
      .post(call)
      .send({ data: { email: "notanemail" } });

    // then
    expect(mock.history.get.length).toBe(0);
    expect(res.status).toEqual(400);
  });

  it("should call Mailchimp on good email", async () => {
    // given
    const call: string = "/api/signup/";

    mock.onAny().reply(200, {});
    const server = initServer();

    // when
    const { body, status } = await request(server)
      .post(call)
      .send({ email: "foo@bar.com" });

    // then
    expect(status).toEqual(200);
    const chimpRegex = new RegExp(`${mailChimpUrl}.*/`);
    expect(mock.history.get.length).toBe(1);
    expect(mock.history.get[0].url).toMatch(chimpRegex);
  });
});
