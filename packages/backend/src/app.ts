import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import logger from "morgan";
import express, {
  NextFunction,
  Request,
  Response,
  json,
  static as staticExpress,
  urlencoded,
} from "express";
import { join } from "path";

import pricesRouter from "./routes/prices";
import quotesRouter from "./routes/quotes";
import signupRouter from "./routes/signup";
import tokensRouter from "./routes/tokens";
import {
  subscribeToPricesTokensDailyUpdates,
  subscribeToPricesTokensHourlyUpdates,
  subscribeToPricesTokensMinuteUpdates,
} from "./utils/prices/pricesGraph";

// TODO migrate to eslint: https://code.visualstudio.com/api/advanced-topics/tslint-eslint-migration
const app = express();
// const swaggerDefinition = {
//   openapi: "3.0.0",
//   info: {
//     title: "SWDAO app API spec",
//     version: "0.1.0",
//     description: "Something very interesting is here",
//     contact: {
//       name: "RG",
//     },
//   },
//   servers: [
//     {
//       url: "http://localhost:3000/api",
//     },
//   ],
// };

// const options = {
//   swaggerDefinition,
//   apis: ["./docs/**/*.yaml"],
// };

// const swaggerSpec = swaggerJSDoc(options);

// Adding in the middleware
// TODO clean up middlewares
app.use(logger("dev")); // Logging framework
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
); // HTTP headers security middleware
app.use(json()); // parse incoming JSONs
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

// app.use(
//   "/api-docs",
//   swaggerUi.serve,
//   swaggerUi.setup(swaggerSpec, { explorer: true })
// );

app.use((req, res, next) => {
  // Express Static just loves to cache, but this stops it.
  res.set("Cache-Control", "no-store");
  next();
});

app.use(cors());

// These are the routers that will receive the call from the FE component
// First field is the path, second is the 'requestHandler'
app.use("/api/quotes", quotesRouter);
app.use("/api/prices", pricesRouter);
app.use("/api/tokens", tokensRouter);
app.use("/api/signup", signupRouter);

// catch all and send to React app
app.use((req: Request, res: Response, next: NextFunction) => {
  const { url } = req;
  if (
    !url.endsWith(".ico") &&
    !url.endsWith(".png") &&
    !url.endsWith(".jpg") &&
    !url.endsWith(".svg") &&
    !url.endsWith(".xml") &&
    !url.endsWith(".webmanifest") &&
    !url.endsWith("manifest.json") &&
    !url.startsWith("/images") &&
    !url.startsWith("/static")
  ) {
    const parts = url.split("?");
    if (parts.length > 0 && parts[1]) {
      req.url = `/index.html?${parts[1]}`;
    } else {
      req.url = "/index.html";
    }
  }
  next();
});

app.use(staticExpress(join(__dirname, "public")));

// error handler
// TODO err typing
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("error");
});

export default app;
