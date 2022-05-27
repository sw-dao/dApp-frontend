import { ApolloServer } from "apollo-server";
import MockAdapter from "axios-mock-adapter";
import express from "express";
import { readFileSync } from "fs";
import request from "supertest";

import app from "../src/app";
import {
  SwappableTokens,
  baseUrl0x,
  baseUrlCoinGecko,
  baseUrlTokenSet,
} from "../src/settings";
import { TokenDetailsResponse } from "../src/types";
import { axiosInstance } from "../src/utils/axios";

const mock = new MockAdapter(axiosInstance);

const initServer = () => {
  const server = express();
  server.use(app);
  return server;
};

describe("Server Endpoints", () => {
  beforeEach(() => {
    mock.reset();
  });

  it("should be callable for a quote", async () => {
    // given
    const url: URL = new URL(`${baseUrl0x}/quote`);
    const SWYF = SwappableTokens.TokenProducts["0x1"].SWD;
    const ETH = SwappableTokens.ERC20["0x1"].ETH;
    const sellAmount = "1000000000000000000";
    const call = `/api/quotes/${SWYF}/${ETH}/${sellAmount}`;
    const quote = {
      price: "10",
      sellAmount: "1000000000000000000",
      data: "unsigned transaction data",
    };

    mock
      .onGet(
        url.toString(),
        expect.objectContaining({
          params: { buyToken: SWYF, sellToken: ETH, sellAmount },
        })
      )
      .reply(200, quote);

    const server = initServer();

    // when
    const res = await request(server)
      .post(call)
      .send({
        data: {
          account: "0x52dddf6a08d2787f2629d582921a684a9e4d2e31",
        },
        chainId: "0x1",
      });

    // then
    expect(JSON.parse(res.text)).toEqual(quote);
    expect(mock.history.get.length).toBe(1);
    expect(res.status).toEqual(200);
  });

  it("should be callable for a swap price", async () => {
    const url: URL = new URL(`${baseUrl0x}/price`);
    const SWYF = SwappableTokens.TokenProducts["0x1"].SWYF;
    const ETH = SwappableTokens.ERC20["0x1"].ETH;
    const sellAmount = "1000000000000000000";
    const call = `/api/prices/${SWYF}/${ETH}/${sellAmount}`;
    const price = {
      price: "10",
      sellAmount: "1000000000000000000",
    };

    mock
      .onGet(
        url.toString(),
        expect.objectContaining({
          params: {
            buyToken: SWYF,
            sellToken: ETH,
            sellAmount,
            chainId: "0x89",
          },
        })
      )
      .reply(200, price);

    const server = initServer();

    // when
    const res = await request(server).post(call).send({ chainId: "0x1" });

    // then
    expect(JSON.parse(res.text)).toEqual(price);
    expect(mock.history.get.length).toBe(1);
    expect(res.status).toEqual(200);
  });

  xit("should be callable for eth price", async () => {
    const call = `/api/tokens/swappable/price/ethereum/?chainId=0x89`;

    const url: URL = new URL(`${baseUrlCoinGecko}/simple/price`);

    const price = {
      ethereum: {
        usd: 4112.68,
        usd_24h_change: -8.753754097075198,
      },
    };

    mock
      .onGet(
        url.toString(),
        expect.objectContaining({
          params: {
            id: "ethereum",
            vs_currencies: "USD",
            include_24hr_change: true,
          },
        })
      )
      .reply(200, price);

    const server = initServer();

    // when
    const res = await request(server).get(call);

    // then
    expect(mock.history.get.length).toBe(1);
    expect(res.status).toEqual(200);
    expect(res.body.data).toEqual(price);
  });

  it("should be callable for allowed tokens", async () => {
    // given
    const call = "/api/tokens/swappable/all?chainId=0x89";
    mock.onAny().abortRequest();
    const server = initServer();

    // when
    const { status, body } = await request(server).get(call);

    // then
    expect(mock.history.get.length).toBe(0);
    expect(mock.history.post.length).toBe(0);
    expect(status).toEqual(200);
    expect(body).toEqual({
      ERC20: { ...SwappableTokens.ERC20["0x89"] },
      TokenProducts: { ...SwappableTokens.TokenProducts["0x89"] },
    });
  });

  it("should be callable for all swappable tokens with CoinGecko and TokenSet data", async () => {
    // given
    const call = "/api/tokens/swappable/products/full/usd/1D?chainId=0x89";

    const server = initServer();

    // when
    const { status, body } = await request(server).get(call);

    // then
    expect(status).toEqual(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body[0]).toMatchObject<TokenDetailsResponse>({
      address: "0xABCDE619a4B46A6da29355023E0533a1332c7D84",
      symbol: "MCK",
    });
  });

  it("should be callable for a swappable token with CoinGecko and TokenSet data", async () => {
    // given
    const call =
      "/api/tokens/swappable/products/0x1fd154b4d0e3753b714b511a53fe1fb72dc7ae1c/usd/1D?chainId=0x1";

    const server = initServer();

    // when
    const { status, body } = await request(server).get(call);

    // then
    expect(status).toEqual(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body[0]).toMatchObject<TokenDetailsResponse>({
      address: "0xABCDE619a4B46A6da29355023E0533a1332c7D84",
      symbol: "MCK",
    });
  });


  it("should return a 404 on non-existent endpoint", async () => {
    // given
    const call = "/thisdoesnotexist";

    const server = initServer();

    // when
    const res = await request(server).get(call);

    // then
    expect(res.status).toEqual(404);
  });
});
