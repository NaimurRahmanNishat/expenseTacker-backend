"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ResponseHandler_1 = require("../utils/ResponseHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return (0, ResponseHandler_1.errorResponse)(res, 401, "Unauthenticated access!");
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET_KEY);
        if (!decoded?.userId) {
            return (0, ResponseHandler_1.errorResponse)(res, 403, "Access denied!");
        }
        req.userId = decoded.userId;
        req.role = decoded.role;
        next();
    }
    catch (error) {
        (0, ResponseHandler_1.errorResponse)(res, 401, "Unauthenticated access!");
    }
};
exports.default = verifyToken;
