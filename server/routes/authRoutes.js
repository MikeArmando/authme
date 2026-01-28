import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import {
  validateSignup,
  validateLogin,
  authenticateToken,
} from "../middleware/validators.js";

const router = express.Router();

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;

// ------------------------- Inicial Validation Check -------------------------
router.get("/dashboard", authenticateToken, (request, response) => {
  response.json({ isAuthenticated: true, user: request.user });
});

// ------------------------------ Logout Logic ------------------------------
router.post("/logout", (request, response) => {
  response.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  response.json({ success: true, message: "Logged out successfully" });
});

// ------------------------------ Sign Up Logic ------------------------------
router.post("/signup", validateSignup, async (request, response) => {
  const {
    "first-name": firstName,
    "last-name": lastName,
    email,
    password,
  } = request.body;

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const queryText = `
      INSERT INTO users (first_name, last_name, email, password)
      VALUES ($1, $2, $3, $4)
      RETURNING first_name AS "firstName", last_name AS "lastName", email;
    `;
    const values = [firstName, lastName, email, hashedPassword];

    const result = await pool.query(queryText, values);
    const user = result.rows[0];

    const token = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    response.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

    response.status(201).json({
      success: true,
      firstName: user.firstName,
      email: user.email,
    });
  } catch (error) {
    console.error("Database Error:", error);

    if (error.code === "23505") {
      return response.status(400).json({
        success: false,
        field: "email",
        message: "This email is already registered.",
      });
    }

    response.status(500).json({
      success: false,
      field: "general",
      message: "An internal error occurred. Please try again later.",
    });
  }
});

// ------------------------------ Log In Logic ------------------------------
router.post("/login", validateLogin, async (request, response) => {
  const { email, password } = request.body;

  try {
    const queryText = "SELECT * FROM users WHERE email = $1;";
    const result = await pool.query(queryText, [email]);

    if (result.rows.length === 0) {
      return response.status(401).json({
        success: false,
        field: "general",
        message: "Invalid email or password.",
      });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return response.status(401).json({
        success: false,
        field: "general",
        message: "Invalid email or password.",
      });
    }

    const userPayload = {
      id: user.id,
      firstName: user["first_name"],
      email: user.email,
    };

    const token = jwt.sign(userPayload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    response.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

    response.status(200).json({
      success: true,
      user: { firstName: user.first_name, email: user.email },
    });
  } catch (error) {
    console.error("Database Error:", error);

    response.status(500).json({
      success: false,
      field: "general",
      message: "An internal error occurred. Please try again later.",
    });
  }
});

export default router;
