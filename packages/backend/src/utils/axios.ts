import { AxiosRequestConfig, AxiosResponse, default as axios } from "axios";
import { defaultHeaders, defaultTimeOut } from "../settings";

import { OutgoingHttpHeaders } from "http";
import axiosThrottle from "axios-request-throttle";
import { setup } from "axios-cache-adapter";

const defaultCache = {
  maxAge: 60 * 1000,
};

axiosThrottle.use(axios, { requestsPerSecond: 240 });

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

  return axios.get(url.toString(), config);
};

const batchGetCall = (
  requests: Promise<AxiosResponse>[]
): Promise<PromiseSettledResult<AxiosResponse>[]> => {
  return Promise.allSettled(requests);
};

export { getCallToUrl, batchGetCall };
