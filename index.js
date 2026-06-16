


// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";

// import connectDB from "./config/db.js";
// import routes from "./routes/index.js";

// dotenv.config();

// connectDB();

// const app = express();

// /* ==============================
//    CORS
// ============================== */

// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "https://k63zgbxb-3000.inc1.devtunnels.ms",
//       "http://localhost:3001",
//       "https://nukkadnatak.com",
//       "http://nukkadnatak.com",
//       "https://admin.nukkadnatak.com",
//       "http://admin.nukkadnatak.com",
//     ],
//     methods: [
//       "GET",
//       "POST",
//       "PUT",
//       "DELETE",
//       "OPTIONS",
//     ],
//     allowedHeaders: [
//       "Content-Type",
//       "Authorization",
//     ],
//     credentials: true,
//   })
// );



// /* ==============================
//    MIDDLEWARE
// ============================== */

// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("API Running Successfully");
// });

// /* ==============================
//    API ROUTES
// ============================== */

// app.use("/api", routes);

// /* ==============================
//    SERVER
// ============================== */

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(
//     `Server Running On Port ${PORT}`
//   );
// });




// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";

// import connectDB from "./config/db.js";
// import routes from "./routes/index.js";

// dotenv.config();

// connectDB();

// const app = express();

// /* ==============================
//    CORS
// ============================== */

// app.use(cors());

// /* ==============================
//    MIDDLEWARE
// ============================== */

// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("API Running Successfully");
// });

// /* ==============================
//    API ROUTES
// ============================== */

// app.use("/api", routes);

// /* ==============================
//    SERVER
// ============================== */

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server Running On Port ${PORT}`);
// });



import express from "express";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import routes from "./routes/index.js";

dotenv.config();
connectDB();

const app = express();

/* ==============================
   MIDDLEWARE
============================== */

app.use(express.json());

/* ==============================
   OPEN ACCESS (NO CORS RESTRICTION)
============================== */

// allow all origins (no CORS blocking)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

/* ==============================
   ROUTES
============================== */

app.get("/", (req, res) => {
  res.send("API Running Successfully");
});

app.use("/api", routes);

/* ==============================
   SERVER
============================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});