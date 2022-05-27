import MockAdapter from "axios-mock-adapter";
import express from "express";
import request from "supertest";

import app from "../../src/app";
import { SwappableTokens, baseUrl0x } from "../../src/settings";
import { QuoteResponse } from "../../src/types";
import { axiosInstance } from "../../src/utils/axios";

const mock = new MockAdapter(axiosInstance);
const initServer = () => {
  const server = express();
  server.use(app);
  return server;
};

const url: URL = new URL(`${baseUrl0x}/price`);

describe("Price Endpoint", () => {
  beforeEach(() => {
    mock.reset();
  });
  it("should allow selected token addresses", async () => {
    // given

    const SWYF = SwappableTokens.TokenProducts["0x1"].SWYF;
    const ETH = SwappableTokens.ERC20["0x1"].ETH;
    const call = `/api/prices/${SWYF}/${ETH}/1000000000000000000`;
    const price = {
      price: 10,
      sellAmount: "1000000000000000000",
      buyTokenPercentageFee: 0,
      feeRecipient: "0x52dddf6a08d2787f2629d582921a684a9e4d2e31",
      test: "prices",
    };

    mock
      .onGet(
        url.toString(),
        expect.objectContaining({
          params: {
            buyToken: SWYF,
            sellAmount: "1000000000000000000",
            buyTokenPercentageFee: 0,
            feeRecipient: "0x52dddf6a08d2787f2629d582921a684a9e4d2e31",
            sellToken: ETH,
            slippagePercentage: 0.005,
            skipValidation: true,
          },
        })
      )
      .reply(200, price);

    const server = initServer();

    // when
    const { body, status } = await request(server)
      .post(call)
      .send({ chainId: "0x1" });

    // then
    expect(status).toEqual(200);
    expect(body).toMatchObject<QuoteResponse>({ price: +price.price });
    expect(mock.history.get.length).toBe(1);
  });

  it("should return a error on non-permitted token swap", async () => {
    // given
    const ETH = SwappableTokens.ERC20["0x3"].ETH;
    const USDC = SwappableTokens.ERC20["0x3"].USDC;
    const call = `/api/prices/${ETH}/${USDC}/1000000000000000000`;

    mock.onAny().abortRequest();
    const server = initServer();

    // when
    const res = await request(server).post(call).send({ chainId: "0x3" });

    // then
    expect(mock.history.post.length).toBe(0);
    expect(res.status).toEqual(400);
  });

  it("should return a 400 on non-address input", async () => {
    // given
    const call = "/api/prices/notAnAddres/012345689/1000000000000000000";
    mock.onAny().abortRequest();
    const server = initServer();

    // when
    const res = await request(server).post(call).send({ chainId: "0x1" });

    // then
    expect(mock.history.post.length).toBe(0);
    expect(res.status).toEqual(400);
  });

  it("should return a 400 on non-permitted token address", async () => {
    // given
    const invalidAddress = "0x0000000000000000000000000000000000000001";
    const ETH = SwappableTokens.ERC20["0x3"].ETH;
    const call = `/api/prices/${invalidAddress}/${ETH}/1000000000000000000`;
    mock.onAny().abortRequest();
    const server = initServer();

    // when
    const res = await request(server).post(call).send({ chainId: "0x3" });

    // then
    expect(mock.history.post.length).toBe(0);
    expect(res.status).toEqual(400);
  });

  it("should return a 400 on non-valid wei amount", async () => {
    // given
    const call = "/api/prices/notAnAddres/012345689/10.0000000000000000";
    mock.onAny().abortRequest();
    const server = initServer();

    // when
    const res = await request(server).post(call).send({ chainId: "0x1" });

    // then
    expect(mock.history.post.length).toBe(0);
    expect(res.status).toEqual(400);
  });
});
