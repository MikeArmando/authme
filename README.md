# AuthMe

A secure, full-stack authentication system built with Node.js, Express, and PostgreSQL.
This project features a complete user registration and login flow. It ensures data integrity through multi-layer validation and prioritizes security by utilizing industry-standard password hashing and environment variable management. Once authenticated, users gain access to a personalized welcome interface.

- **Live:** [AuthMe](https://authme-red.vercel.app)

## Preview

![Signup Page](/public/assets/signup-image.png)
![Login Page](/public/assets/login-image.png)
![Welcome Page](/public/assets/welcome-image.png)

## Key Features

- **Dynamic User Registration:** Capture user data via validated form.
- **Modular Architecture:** Clean code structure using ES Modules.
- **Data Persistence:** Uses PostgreSQL as a database to store data.
- **Complete Validation:** Complete validation of users credentials.
- **Responsive Design:** Fully functional on mobile and desktop.

## Security Features

- **Password Hashing:** bcrypt with salt rounds to ensure user passwords are never stored in plain text.
- **Environment Variables:** Sensitive database credentials are managed via dotenv and kept out of version control.
- **SQL Injection Protection:** All database queries use parameterized inputs to prevent malicious attacks.
- **Input Sanitization:** Emails are normalized (lowercased/trimmed) and names are sanitized before processing.

## Architecture

The project follows a modular structure:

- `/client`: Frontend assets and DOM logic.
- `/server`: Express routes and API logic.
- `.env`: (Ignored) Secure configuration.

## Tech Stack

**Frontend:** HTML5, CSS3, JavaScript (ES6+)

**Backend:** Node.js, Express.js

**Database:** PostgreSQL

**Security:** Bcrypt (Hashing), Dotenv (Environment Variables), node-postgres (pg)
