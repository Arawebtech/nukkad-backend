


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

// app.use(cors({
//   origin: [
//     "https://admin.nukkadnatak.com",
//     "https://www.admin.nukkadnatak.com",
//     "https://www.nukkadnatak.com",
//     "https://nukkadnatak.com",
//     "http://nukkadnatak.com",
//     "http://admin.nukkadnatak.com",
//     "http://backend.nukkadnatak.com",
//     "http://localhost:3000",
//     "http://localhost:3001"
//   ],
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// }));

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
import cors from "cors";

import connectDB from "./config/db.js";
import routes from "./routes/index.js";

dotenv.config();

connectDB();

const app = express();

/* ==============================
   CORS — Manual headers first (shared hosting fix)
============================== */

app.use((req, res, next) => {
  const allowedOrigins = [
    "https://nukkadnatak.com",
    "http://nukkadnatak.com",
    "https://www.nukkadnatak.com",
    "https://admin.nukkadnatak.com",
    "http://admin.nukkadnatak.com",
    "http://localhost:3000",
    "http://localhost:3001",
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(
  cors({
    origin: [
      "https://nukkadnatak.com",
      "http://nukkadnatak.com",
      "https://www.nukkadnatak.com",
      "https://admin.nukkadnatak.com",
      "http://admin.nukkadnatak.com",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ==============================
   MIDDLEWARE
============================== */

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running Successfully");
});

/* ==============================
   API ROUTES
============================== */

app.use("/api", routes);

/* ==============================
   SERVER
============================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});