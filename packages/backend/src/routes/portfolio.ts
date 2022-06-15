import express, { Request, Response, Router } from "express";
import {
  Result,
  ValidationError,
  body,
  param,
  validationResult,
} from "express-validator";

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
    console.log(`Getting Portfolio`, positionsRequest);
    res.json(positionsRequest);
  }
);

export default router;
