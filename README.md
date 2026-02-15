# AuthMe

A secure, full-stack authentication system built with Node.js, Express, and PostgreSQL. This project features a complete user registration and login flow, prioritizing defense-in-depth security. It utilizes multi-layer validation, industry-standard password hashing, and sophisticated request throttling to prevent common web vulnerabilities.

- **Live:** [AuthMe](https://authme-red.vercel.app)

## Preview

![Signup Page](/public/assets/signup-image.png)
![Login Page](/public/assets/login-image.png)
![Dashboard Page](/public/assets/dashboard.png)

## Key Features

- **JWT-Based Authentication:** Secure session management using JSON Web Tokens.
- **Unified Error Handling:** Custom "Helper Functions" translate complex backend validation errors into user-friendly UI feedback.
- **Clean Architecture:** Modular ESM structure with dedicated layers for routing, validation, and database configuration.
- **Data Integrity:** Schema-based validation ensures that only "clean" data enters the system.
- **Data Persistence:** Uses PostgreSQL (Hosted on Neon) as a database to store data.
- **Responsive Design:** Fully functional on mobile and desktop.

## Security Features

- **Brute Force Protection:** Implements `express-rate-limit` to throttle login/signup attempts and prevent automated attacks.
- **HTTP-Only Cookies:** JWTs are stored in `httpOnly` cookies, making them inaccessible to client-side scripts, providing robust protection against XSS.
- **CSRF Defense:** Cookies utilize `SameSite: Strict` flags to prevent cross-site request forgery.
- **Input Sanitization & Validation:** Leverages Zod for strict schema enforcement, email normalization, and protection against malformed inputs.
- **Password Hashing:** Uses `bcrypt` with salt rounds to secure user credentials at rest.
- **SQL Injection Protection:** Employs parameterized queries via pg to neutralize injection vectors.

## Architecture

The project follows a modular structure:

- `/public`: Frontend assets and DOM logic.
- `/server/routes`: Express routes and API logic.
- `/server/middleware`: Dedicated validators and schema for auth and rate limiting.
- `server/config`: Database pool configuration.
- `.env`: (Ignored) Secure configuration.

## Tech Stack

**Frontend:** HTML5, CSS3, JavaScript (ES6+)

**Backend:** Node.js, Express.js

**Database:** Neon (Serverless PostgreSQL)

**Deployment:** Vercel (Serverless Functions)

**Security & Validation:** 
- Zod (Schema validation and data transformation),

- Bcrypt: Secure password hashing.

- JWT: Stateless session tokens.

- Express-Rate-Limit: Request throttling/Spam prevention.

- Cookie-Parser: Secure cookie handling.
