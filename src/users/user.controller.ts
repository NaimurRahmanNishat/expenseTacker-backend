import { errorResponse, successResponse } from "../utils/ResponseHandler";
import { Request, Response } from "express";
import User, { IUser } from "./user.model";
import generateToken from "../middleware/generateToken";
import { Types } from "mongoose";

const userRegister = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password }: { username: string; email: string; password: string } = req.body;
    if (!username || !email || !password) {
      return errorResponse( res, 400, "Username, email, and password are required");
    }
    const user: IUser = new User({ username, email, password });
    if (await User.findOne({ email })) {
      return errorResponse(res, 400, "User already exists!");
    }
    await user.save();
    return successResponse(res, 201, "User registered successfully", user);
  } catch (error) {
    return errorResponse(res, 500, "User registration failed!");
  }
}

const userLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: { email: string; password: string } = req.body;

    const user = (await User.findOne({ email })) as IUser | null;

    if (!user) {
      res.status(404).send({ message: "User not found!" });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).send({ message: "Invalid Password!" });
      return;
    }

    const token = await generateToken(user._id as Types.ObjectId);

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
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).send({ message: "Login failed!" });
  }
}

const userLogout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax", 
      secure: process.env.NODE_ENV === "production", 
    });
    successResponse(res, 200, "Logout successful!");
  } catch (error) {
    console.error("Logout error:", error);
    errorResponse(res, 500, "Logout failed!");
  }
}

export { userRegister, userLogin, userLogout };