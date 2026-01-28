import jwt from "jsonwebtoken";

// ------------------------------ Validate Sign up ------------------------------
export const validateSignup = (request, response, next) => {
  const {
    "first-name": rawFirstName,
    "last-name": rawLastName,
    email: rawEmail,
    password,
    "confirm-password": confirmPassword,
  } = request.body;

  const firstName = rawFirstName?.trim();
  const lastName = rawLastName?.trim();
  const email = rawEmail?.toLowerCase().trim();

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return response.status(400).json({
      field: "general",
      message: "All fields are required.",
    });
  }

  if (firstName.length > 100) {
    return response.status(400).json({
      field: "first-name",
      message: "Name cannot be more than 100 characters.",
    });
  }

  if (lastName.length > 100) {
    return response.status(400).json({
      field: "last-name",
      message: "Name cannot be more than 100 characters.",
    });
  }

  if (email.length > 255) {
    return response.status(400).json({
      field: "email",
      message: "email cannot be more than 255 characters.",
    });
  }

  if (password !== confirmPassword) {
    return response.status(400).json({
      field: "confirm-password",
      message: "Passwords don't match.",
    });
  }

  if (password.length < 12) {
    return response.status(400).json({
      field: "password",
      message: "Password must be at least 12 characters.",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return response.status(400).json({
      field: "email",
      message: "Invalid email format.",
    });
  }

  next();
};

// ------------------------------ Validate Log in ------------------------------
export const validateLogin = (request, response, next) => {
  const rawEmail = request.body.email;
  const password = request.body.password;

  const email = rawEmail?.toLowerCase().trim();

  if (!email || !password) {
    return response.status(400).json({
      field: "general",
      message: "Enter both email and password.",
    });
  }

  next();
};

export const authenticateToken = (request, response, next) => {
  const token = request.cookies.token;

  if (!token) {
    return response
      .status(401)
      .json({ success: false, message: "Access denied" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    request.user = verified;

    next();
  } catch (error) {
    response.status(400).json({ success: false, message: "Invalid Token" });
  }
};
