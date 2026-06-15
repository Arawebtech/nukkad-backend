import express from "express";

import adminRoutes from "./adminRoutes.js";

import categoryRoutes from "./categoryRoutes.js";

// import serviceRoutes from "./serviceRoutes.js";
import servicesRoutes from "./services.Routes.js";

import careerRoutes from "./careerRoutes.js";

import inquiryRoutes from "./enquiryRoutes.js";

import galleryRoutes from "./galleryRoutes.js";

import dashboardRoutes from "./dashboardRoutes.js";

import trafficRoutes from "./trafficRoutes.js";


import blogRoutes from "./BlogRoutes.js";

const router =
  express.Router();



router.use(
  "/admin",
  adminRoutes
);

router.use(
  "/category",
  categoryRoutes
);

// router.use(
//   "/service",
//   serviceRoutes
// );

router.use(
  "/services",
  servicesRoutes
);

router.use(
  "/career",
  careerRoutes
);
router.use(
  "/enquiry",
  inquiryRoutes
);

router.use(
  "/gallery",
  galleryRoutes
);

router.use(
  "/dashboard",
  dashboardRoutes
);

router.use(
  "/traffic",
  trafficRoutes
);


router.use(
  "/api/blog",
  blogRoutes
);

export default router;