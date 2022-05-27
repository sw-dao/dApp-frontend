import express, { Request, Response, Router } from "express";
import { AxiosResponse } from "axios";
import { EmailSignupRequest } from "src/types";
import {
  Result,
  ValidationError,
  body,
  param,
  validationResult,
} from "express-validator";
import { URL } from "url";

import { axiosInstance } from "../utils/axios";
import { handleError } from "../utils/error";
import { mailChimpApiKey, mailChimpListId, mailChimpUrl } from "../settings";

const router: Router = express.Router();

router.post(
  "/",
  body("email", "Please provide valid email address")
    .notEmpty()
    .trim()
    .isEmail(),
  async (req: Request, res: Response) => {
    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const email = req.body.email;

    const url: URL = new URL(
      `${mailChimpUrl}/subscribe/post-json?u=${mailChimpApiKey}&id=${mailChimpListId}&EMAIL=${email}&FNAME=&LNAME=`
    );

    console.log(`signing up ${email} at ${url}`);

    const emailResponse = await axiosInstance
      .get(url.toString())
      .then((response: AxiosResponse) => {
        return response.data;
      })
      .catch((error) => {
        handleError(error);
      });

    res.json(emailResponse);
  }
);

export default router;
