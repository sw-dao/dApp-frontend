import express, { Request, Response, Router } from "express";
import {
  Result,
  ValidationError,
  body,
  param,
  validationResult,
} from "express-validator";
import getTxHistory from "../utils/0x/getTxHistory";

import { getPositions } from "../utils/0x/getPortfolio";

const router: Router = express.Router();

router.get(
  "/holdings/:address/",
  param("address", "Please provide a valid account address")
    .notEmpty()
    .trim()
    .isEthereumAddress(),

  async (req: Request, res: Response) => {
    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const positionsRequest = await getPositions(req.params.address);
    // console.log(`Getting Portfolio`, positionsRequest);
    res.json(positionsRequest);
  }
);

router.get(
  "/history/:address",
  param("address", "Please provide a valiid account address")
    .notEmpty()
    .trim()
    .isEthereumAddress(),
  async (req: Request, res: Response) => {
    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    await getTxHistory(req.params.address).then((r) => {
      // console.log(`Getting Portfolio`, r);
      res.json(r);
    });
  }
);

export default router;
