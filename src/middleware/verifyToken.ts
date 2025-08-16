import { Request, Response, NextFunction } from "express"
import { errorResponse } from "../utils/ResponseHandler";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;
declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
    role?: string;
  }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return errorResponse(res, 401, "Unauthenticated access!");
    }
    const decoded = jwt.verify(token, JWT_SECRET_KEY) as {
      userId: string;
      role: string;
    };
    if (!decoded?.userId) {
      return errorResponse(res, 403, "Access denied!");
    }

    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (error) {
    errorResponse(res, 401, "Unauthenticated access!");
  }
}

export default verifyToken;