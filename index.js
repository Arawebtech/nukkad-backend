import express from "express";

import dotenv from "dotenv";

import cors from "cors";

import connectDB from "./config/db.js";

import routes from "./routes/index.js";

dotenv.config();

connectDB();

const app = express();

/* ==============================
   MIDDLEWARE
============================== */

app.use(cors());

app.use(express.json());


app.get("/", (req, res) => {
  res.send(
    "API Running Successfully"
  );
});

/* ==============================
   API ROUTES
============================== */

app.use("/api", routes);

/* ==============================
   SERVER
============================== */

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server Running On Port ${PORT}`
  );
});