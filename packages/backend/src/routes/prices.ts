import { URL } from "url";
import util from "util";

import { AxiosResponse } from "axios";
import { utils } from "ethers";
import express, { Request, Response, Router } from "express";
import {
  Result,
  ValidationError,
  body,
  param,
  validationResult,
} from "express-validator";

import { SwapRequest } from "../types";
import { getSwapParameters, validSwap, validToken } from "../utils/0x";
import { getCallToUrl } from "../utils/axios";
import { handleError } from "../utils/error";
import { baseUrl0x } from "src/settings";

const router: Router = express.Router();

// const baseUrl0x = "https://polygon.api.0x.org/swap/v1";

/* GET prices from 0x API. */
// TODO DRY validation
router.post(
  "/:buyToken/:sellToken/:sellAmount",
  param(["buyToken", "sellToken"], "Please provide valid token address")
    .notEmpty()
    .trim()
    .isEthereumAddress()
    .custom((value, { req }) => validToken(req?.body?.data?.chainId, value)),
  param("buyToken").custom((value, { req }) =>
    validSwap(req?.body?.data?.chainId, value, req?.params?.sellToken)
  ),
  param("sellAmount", "Please provide valid amount").notEmpty().trim().isInt(),
  body("data.chainId", "Please provide valid chainId").notEmpty().trim(),
  async (req: Request, res: Response) => {
    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const url: URL = new URL(`${baseUrl0x}/price`);
    const priceRequest: SwapRequest = await getSwapParameters(req);

    // console.log(`priceRequest to ${url.toString()}:\n ${JSON.stringify(priceRequest, null, 2)}`);
    const priceResponse = await getCallToUrl(url, { params: priceRequest })
      .then((response: AxiosResponse) => {
        return response.data;
      })
      .catch((error) => {
        return handleError(error);
      });

    res.json(priceResponse);
  }
);

export default router;
