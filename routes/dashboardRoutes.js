// routes/dashboard.routes.js

import express from "express";

import {
  getDashboardStats,
} from "../controllers/dashboard.controller.js";

const router = express.Router();

/* =================================
   DASHBOARD ROUTE
================================= */

router.get(
  "/stats",
  getDashboardStats
);

export default router;