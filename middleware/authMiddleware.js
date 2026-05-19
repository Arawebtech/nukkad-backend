import jwt from "jsonwebtoken";

import dotenv from "dotenv";

dotenv.config();

const authMiddleware = async (
  req,
  res,
  next
) => {
  try {
    const authHeader =
      req.headers.authorization;



    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No token",
      });
    }

    // REMOVE "Bearer "
    const token =
      authHeader.split(" ")[1];



    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

 

    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);

    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

export default authMiddleware;