import Admin from "../models/admin.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password)
    return next(errorHandler(400, "Username and password are required"));
  if (password.length < 6)
    return next(errorHandler(400, "Password must be at least 6 characters"));

  try {
    const existing = await Admin.findOne({ username });
    if (existing) return next(errorHandler(400, "Username already exists"));

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newAdmin = new Admin({ username, password: hashedPassword });
    await newAdmin.save();
    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (!process.env.JWT_SECRET)
      return next(errorHandler(500, "JWT secret is not defined"));

    const validAdmin = await Admin.findOne({ username });
    if (!validAdmin) return next(errorHandler(404, "Admin not found"));

    const validPassword = bcryptjs.compareSync(password, validAdmin.password);
    if (!validPassword) return next(errorHandler(401, "Invalid credentials"));

    const token = jwt.sign({ id: validAdmin._id, role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const { password: pass, ...rest } = validAdmin._doc;

    res
      .cookie("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ ...rest, token });
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("admin_token");
    res.status(200).json({ message: "Admin signed out successfully" });
  } catch (error) {
    next(error);
  }
};
