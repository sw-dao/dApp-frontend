const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");

const app = express();

const apiProxy = createProxyMiddleware({
  target: "https://stage-dot-sw-dao.ey.r.appspot.com",
  changeOrigin: true,
});
const uiProxy = createProxyMiddleware({
  target: "http://localhost:3001",
  changeOrigin: true,
});

app.use("/api", apiProxy);
app.use("/", uiProxy);
app.listen(3030);
