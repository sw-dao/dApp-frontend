import util from 'util';

import express, { Request, Response, Router } from "express";
import {
  Result,
  ValidationError,
  body,
  param,
  validationResult
} from "express-validator";

import { baseUrl0x } from "../settings";
import { SwapRequest } from "../types";
import { getSwapParameters, validSwap, validToken } from "../utils/0x";
import { getCallToUrl } from "../utils/axios";
import { handleError } from "../utils/error";

const router: Router = express.Router();

/* GET prices from 0x API. */
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
  param("sellAmount", "Please provide valid amount")
    .notEmpty()
    .trim()
    .isInt(),
  body("data.account", "Please provider user address")
    .notEmpty()
    .trim()
    .isEthereumAddress(),
  body("data.chainId", "Please provide valid chainId")
  .notEmpty()
  .trim(),
  async (req: Request, res: Response) => {
    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const url: URL = new URL(`${baseUrl0x}/quote`);

    const quoteRequest: SwapRequest = await getSwapParameters(req, false);

    const quoteResponse = await getCallToUrl(url, {
      params: quoteRequest,
      timeout: 5000,  // Default timeout is not sufficient
    })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return handleError(error);
      });
    res.json(quoteResponse);
  }
);

export default router;
