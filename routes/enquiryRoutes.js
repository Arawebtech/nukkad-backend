import express from "express";

import {
  createEnquiry,
  getAllEnquiries,
  getSingleEnquiry,
  updateEnquiryStatus,
  deleteEnquiry,
} from "../controllers/enquiry.controller.js";

const router = express.Router();

/* =========================
   CREATE
========================= */
router.post("/create", createEnquiry);

/* =========================
   GET ALL
========================= */
router.get("/all", getAllEnquiries);

/* =========================
   GET SINGLE
========================= */
router.get("/:id", getSingleEnquiry);

/* =========================
   UPDATE STATUS
========================= */
router.put("/update/:id", updateEnquiryStatus);

/* =========================
   DELETE
========================= */
router.delete("/delete/:id", deleteEnquiry);

export default router;