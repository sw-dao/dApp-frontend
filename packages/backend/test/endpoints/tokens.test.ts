import express from "express";
import request from "supertest";

import app from "../../src/app";
import { SwappableTokens } from "../../src/settings";
import { SwappableTokensResponse, TokenDetailsResponse } from "../../src/types";

const initServer = () => {
  const server = express();
  server.use(app);
  return server;
};

describe("Tokens Endpoint", () => {
  it("should return error for invalid timeframe", async () => {
    // given
    const call: string =
      "/api/tokens/swappable/products/full/usd/1day?chainId=0x89";

    const server = initServer();

    // when
    const res = await request(server).get(call);

    // then
    expect(res.status).toEqual(400);
  });

  it("should return a list of swappable tokens and addresses", async () => {
    // given
    const call: string = "/api/tokens/swappable/all?chainId=0x89";
    const server = initServer();

    // when
    const { body, status } = await request(server).get(call);

    // then
    expect(status).toEqual(200);
    expect(body).toMatchObject<SwappableTokensResponse>({
      ERC20: { ...SwappableTokens.ERC20["0x89"] },
      TokenProducts: { ...SwappableTokens.TokenProducts["0x89"] },
    });
  });

  it("should return product info with CoinGecko and TokenSet data for valid timeframe", async () => {
    // given
    const address = SwappableTokens.TokenProducts["0x1"].SWD;
    const call: string = `/api/tokens/swappable/products/${address}/usd/1D?chainId=0x1`;

    const server = initServer();

    // when
    const { status, body } = await request(server).get(call);

    // then
    expect(status).toEqual(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body[0]).toMatchObject<TokenDetailsResponse>({ symbol: "MCK" });
  });
});
