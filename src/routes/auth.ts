import { Router, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User.js";
import {LOG_MESSAGES} from "../utils/constants.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_fallback_secret_key";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

// Helper to generate JWT and attach HttpOnly Cookie
const sendAuthTokenCookie = (res: Response, userId: string) => {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "30d" });

  res.cookie("auth_token", token, {
    httpOnly: true, // Prevents client-side JS from reading the cookie (XSS protection)
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "lax", // CSRF protection
    maxAge: THIRTY_DAYS_MS, // 30 days in milliseconds
  });
};

// POST /register
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, username, name, role, createdAt, updatedAt } = req.body;

    if (!email || !password || !username || !name || !role) {
      res.status(400).json({ message: LOG_MESSAGES.AUTH.REQUIRED_ALL_FIELDS });
      return;
    }

    const existingUser = await UserModel.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      res.status(409).json({ message: LOG_MESSAGES.AUTH.USER_EXISTS });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UserModel.create({
      email,
      password: hashedPassword,
      username,
      name,
      role, 
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    sendAuthTokenCookie(res, newUser._id.toString());

    res.status(201).json({
      message: LOG_MESSAGES.AUTH.USER_REGISTERED,
      user: { id: newUser._id, email: newUser.email },
    });
  } catch (error) {
    res.status(500).json({ message: LOG_MESSAGES.AUTH.INTERNAL_SERVER_ERROR, error });
  }
});

// POST /login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: LOG_MESSAGES.AUTH.REQUIRED_ID_PASS });
      return;
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(401).json({ message: LOG_MESSAGES.AUTH.INVALID_CREDS });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: LOG_MESSAGES.AUTH.INVALID_CREDS });
      return;
    }

    sendAuthTokenCookie(res, user._id.toString());

    res.status(200).json({
      message: LOG_MESSAGES.AUTH.LOGIN_SUCCESSFUL,
      user: { id: user._id, email: user.email, username: user.username, name: user.name, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: LOG_MESSAGES.AUTH.INTERNAL_SERVER_ERROR, error });
  }
});

// POST /logout
router.post("/logout", (_req: Request, res: Response): void => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.status(200).json({ message: LOG_MESSAGES.AUTH.LOGGED_OUT });
});

export default router;