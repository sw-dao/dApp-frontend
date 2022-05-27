import { AxiosRequestConfig, AxiosResponse } from "axios";
import { defaultHeaders, defaultTimeOut } from "../settings";

import { OutgoingHttpHeaders } from "http";
import axiosThrottle from "axios-request-throttle";
import { setup } from "axios-cache-adapter";

const defaultCache = {
  maxAge: 30 * 1000,
};

const axiosInstance = setup({
  // `axios` options
  timeout: defaultTimeOut,
  headers: defaultHeaders,
  // `axios-cache-adapter` options
  cache: defaultCache,
});

axiosThrottle.use(axiosInstance, { requestsPerSecond: 24 }); // cache 30seconds and CoinGecko max is 50call/minute

const getCallToUrl = (
  url: URL,
  options?: {
    timeout?: number;
    params?: { [key: string]: string | number | boolean };
    headers?: OutgoingHttpHeaders;
    cache?: { maxAge?: number; exclude?: { query?: boolean } };
  }
): Promise<AxiosResponse> => {
  const config: AxiosRequestConfig = {
    timeout: options?.timeout || defaultTimeOut,
    headers: { ...defaultHeaders, ...options?.headers },
    params: options?.params,
    cache: { ...defaultCache, ...options?.cache },
  };

  // console.log(`Axios: ${url.toString()} config: ${JSON.stringify(config)}`);

  return axiosInstance.get(url.toString(), config);
};

const batchGetCall = (
  requests: Promise<AxiosResponse>[]
): Promise<PromiseSettledResult<AxiosResponse>[]> => {
  return Promise.allSettled(requests);
};

export { getCallToUrl, batchGetCall, axiosInstance };
