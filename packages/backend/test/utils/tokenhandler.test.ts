import { SwappableTokens } from "../../src/settings";
import express from "express";
import request from "supertest";
import app from "../../src/app";
import { ApolloServer } from "apollo-server";
import { readFileSync } from "fs";
import GraphServer from "../mockGraph";
import { TokenDetailsResponse } from "../../src/types";

const initServer = () => {
  const server = express();
  server.use(app);
  return server;
};

describe("Tokendata util", () => {
  it("should have access to 6 tokens", () => {
    // given
    const tokenProducts = Object.keys(SwappableTokens.TokenProducts["0x1"]);
    const erc20 = Object.keys(SwappableTokens.ERC20["0x1"]);
    // when
    const allTokens = Array.from(new Set([...tokenProducts, ...erc20]));

    // then
    expect(allTokens.length).toEqual(7);
  });

  it("Gets data from GraphQL backend", async () => {
    const server = initServer();

    const call: string = `/api/tokens/swappable/products/0x1fd154b4d0e3753b714b511a53fe1fb72dc7ae1c/usd/1D?chainId=0x1`;

    const { status, body } = await request(server).get(call);
    // then
    expect(status).toEqual(200);
    expect(body[0]).toMatchObject<TokenDetailsResponse>({
      address: "0xABCDE619a4B46A6da29355023E0533a1332c7D84",
      symbol: "MCK",
    });
  });
});
