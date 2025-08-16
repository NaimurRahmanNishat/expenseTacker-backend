"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogout = exports.userLogin = exports.userRegister = void 0;
const ResponseHandler_1 = require("../utils/ResponseHandler");
const user_model_1 = __importDefault(require("./user.model"));
const generateToken_1 = __importDefault(require("../middleware/generateToken"));
const userRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return (0, ResponseHandler_1.errorResponse)(res, 400, "Username, email, and password are required");
        }
        const user = new user_model_1.default({ username, email, password });
        if (await user_model_1.default.findOne({ email })) {
            return (0, ResponseHandler_1.errorResponse)(res, 400, "User already exists!");
        }
        await user.save();
        return (0, ResponseHandler_1.successResponse)(res, 201, "User registered successfully", user);
    }
    catch (error) {
        return (0, ResponseHandler_1.errorResponse)(res, 500, "User registration failed!");
    }
};
exports.userRegister = userRegister;
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = (await user_model_1.default.findOne({ email }));
        if (!user) {
            res.status(404).send({ message: "User not found!" });
            return;
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).send({ message: "Invalid Password!" });
            return;
        }
        const token = await (0, generateToken_1.default)(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        res.status(200).send({
            message: "Logged in successfully!",
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            },
        });
    }
    catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).send({ message: "Login failed!" });
    }
};
exports.userLogin = userLogin;
const userLogout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });
        (0, ResponseHandler_1.successResponse)(res, 200, "Logout successful!");
    }
    catch (error) {
        console.error("Logout error:", error);
        (0, ResponseHandler_1.errorResponse)(res, 500, "Logout failed!");
    }
};
exports.userLogout = userLogout;
