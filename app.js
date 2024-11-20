const express = require("express");
const reqResInspector = require("express-req-res-inspector");
const {
  globalErrorMiddleware,
} = require("./middleware/globalError.middleware");
const cookieParser=require("cookie-parser")
const app = express();

app.use(reqResInspector());
app.use(express.json({ limit: "16kb" }));
app.use(globalErrorMiddleware);
app.use(cookieParser())
module.exports = app;
