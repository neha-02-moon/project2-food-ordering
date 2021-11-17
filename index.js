require("dotenv").config();
const cors = require("cors");
const express = require("express");
const { connect } = require("mongoose");

const port = process.env.PORT || 5000;

(async () => {
  const app = express();

  app.use(express.json());
  app.use(cors({ origin: "http://localhost:3000" }));

  try {
    await connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connected to db");
  } catch (error) {
    console.log(error.message);
  }

  app.use("/", require("./routes"));

  app.listen(port, () => {
    console.log(`listening to app on port ${port}`);
  });
})();
