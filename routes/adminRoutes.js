import express from "express";

import { loginAdmin, updateAdmin, updatePassword } from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";
// import upload from "../middleware/multer.js";
import multer from "multer";

const router = express.Router();
const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post("/login", loginAdmin);
/* ================= PROFILE UPDATE (with images) ================= */
router.put(
  "/update/details-all",
  authMiddleware,
  upload.fields([
    { name: "companyLogo", maxCount: 1 },
    { name: "userDp", maxCount: 1 },
  ]),
  updateAdmin
);

/* ================= PASSWORD UPDATE ================= */
router.put("/update-password", authMiddleware, updatePassword);

export default router;