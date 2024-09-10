const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const rootRouter = require("./routes/index")
const accountRouter = require("./routes/account")

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1", rootRouter)
app.use("/api/v1/account", accountRouter)

app.listen(3000);



