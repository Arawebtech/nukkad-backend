// routes/traffic.routes.js

import express from "express";

import {
  getTrafficStats,
} from "../controllers/traffic.controller.js";
import { saveTraffic } from "../middleware/traffic.middleware.js";

const router = express.Router();

/* =================================
   TRAFFIC ROUTES
================================= */
router.post(
  "/save",
  saveTraffic
);

router.get(
  "/stats",
  getTrafficStats
);

export default router;