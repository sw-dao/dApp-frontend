import { axiosInstance, getCallToUrl } from "../../src/utils/axios";
import {
  baseUrlCoinGecko,
  defaultTimeOut,
  defaultHeaders,
} from "../../src/settings";
import { OutgoingHttpHeaders } from "http";
import MockAdapter from "axios-mock-adapter";

const mock = new MockAdapter(axiosInstance);
describe("Axios utils", () => {
  beforeEach(() => {
    mock.resetHistory();
  });

  it("should be a standard for async GET API calls using default config", async () => {
    const url: URL = new URL(`${baseUrlCoinGecko}/ping`);
    const pingResponse = {
      gecko_says: "(V3) To the Moon!",
    };

    mock
      .onGet(
        url.toString(),
        expect.objectContaining({
          headers: defaultHeaders,
          timeout: defaultTimeOut,
          params: undefined,
        })
      )
      .reply(200, pingResponse);

    const res = await getCallToUrl(url);

    expect(mock.history.get.length).toBe(1);
    expect(mock.history.get[0].url).toBe(url.toString());
    expect(res.data).toEqual(pingResponse);
  });

  it("should allow overriding of call timeout", async () => {
    const url: URL = new URL(`${baseUrlCoinGecko}/ping`);
    const pingResponse = {
      gecko_says: "(V3) To the Moon!",
    };

    const timeout: number = 1000;

    mock
      .onGet(
        url.toString(),
        expect.objectContaining({
          headers: defaultHeaders,
          timeout,
          params: undefined,
        })
      )
      .reply(200, pingResponse);

    const res = await getCallToUrl(url);

    expect(mock.history.get.length).toBe(1);
    expect(mock.history.get[0].url).toBe(url.toString());
    expect(res.data).toEqual(pingResponse);
  });

  it("should allow overriding of call headers", async () => {
    const url: URL = new URL(`${baseUrlCoinGecko}/ping`);
    const pingResponse = {
      gecko_says: "(V3) To the Moon!",
    };

    const headers: OutgoingHttpHeaders = { "x-token": "my-token" };

    mock
      .onGet(
        url.toString(),
        expect.objectContaining({
          headers,
          timeout: defaultTimeOut,
          params: undefined,
        })
      )
      .reply(200, pingResponse);

    const res = await getCallToUrl(url, { headers });

    expect(mock.history.get.length).toBe(1);
    expect(mock.history.get[0].url).toBe(url.toString());
    expect(res.data).toEqual(pingResponse);
  });

  it("should allow setting of call params", async () => {
    const url: URL = new URL(`${baseUrlCoinGecko}/ping`);
    const pingResponse = {
      gecko_says: "(V3) To the Moon!",
    };

    const params = { test: "parameterInput" };

    mock
      .onGet(
        url.toString(),
        expect.objectContaining({
          headers: defaultHeaders,
          timeout: defaultTimeOut,
          params: undefined,
        })
      )
      .reply(200, pingResponse);

    const res = await getCallToUrl(url, { params });

    expect(mock.history.get.length).toBe(1);
    expect(mock.history.get[0].url).toBe(url.toString());
    expect(res.data).toEqual(pingResponse);
  });

  it("should use the caching plugin", async () => {
    const url = new URL("https://api.sampleapis.com/futurama/characters");

    mock.restore();
    const res = await getCallToUrl(url);

    // `response.request` will contain the origin `axios` request object
    expect(res.request.fromCache).not.toBe(true);

    // Second request to same endpoint will be served from cache
    const anotherResponse = await getCallToUrl(url);

    // `response.request` will contain `fromCache` boolean
    expect(anotherResponse.request.fromCache).toEqual(true);
  });
});
