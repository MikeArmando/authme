import express from "express";
import pg from "pg";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("client"));
app.use(express.json());

const { Pool } = pg;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// -------------------------- Sign Up --------------------------
app.post("/api/signup", async (request, response) => {
  const userData = request.body;

  try {
    const queryText = `
      INSERT INTO users (first_name, last_name, email, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email;
    `;

    const values = [
      userData["first-name"],
      userData["last-name"],
      userData.email,
      userData.password,
    ];

    const result = await pool.query(queryText, values);

    console.log("User saved to DB:", result.rows[0]);

    response.status(201).json({
      message: "User created successfully!",
      userId: result.rows[0].id,
    });
  } catch (error) {
    console.error("Database Error:", error);

    if (error.code === "23505") {
      return response.status(400).json({ message: "Email already in use." });
    }

    response.status(500).json({ message: "Internal Server Error" });
  }
});

// -------------------------- Log In --------------------------
app.post("/api/login", async (request, response) => {
  const { email, password } = request.body;

  try {
    const queryText = "SELECT * FROM users WHERE email = $1;";
    const result = await pool.query(queryText, [email]);

    if (result.rows.length === 0) {
      return response
        .status(401)
        .json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];

    if (user.password === password) {
      response.status(200).json({
        message: "Login successful!",
        user: { id: user.id, firstName: user.first_name },
      });
    } else {
      response.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Database Error:", error);

    response.status(500).json({ message: "Internal Server Error" });
  }
});

// -----------------------------------------------------------
app.listen(PORT, () =>
  console.log(`Server listening at: http://localhost:${PORT}`)
);
