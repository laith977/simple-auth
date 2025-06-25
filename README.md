
# User Authentication API with SQLite and Node.js

A simple Node.js backend for user authentication using SQLite, with secure password hashing and session management.

## Features

- User registration with validation
- Secure password hashing with bcrypt
- Unique username enforcement at the database level
- User login with session handling
- Logout and session destruction
- Get currently logged-in user info
- Basic input validation and error handling

## Technologies

- Node.js
- SQLite
- bcryptjs for password hashing
- Express (assumed, can be adapted)
- Express-session for session management (assumed)

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- SQLite3 installed or use the SQLite3 Node package

### Installation

1. Clone the repository

```bash
git clone https:/github.com/laith977/simple-auth.git
cd simple-auth
```

2. Install dependencies

```bash
npm install
```

3. Initialize the SQLite database and create the users table

```bash
node init-db.js
```

4. Start the server

```bash
npm start
```

### Environment Variables

Make sure to configure any environment variables if required for session secret or database path.

Example `.env` file:

```
SESSION_SECRET=your_secret_key
DATABASE_PATH=./db.sqlite3
```

## API Endpoints

### Register a new user

- **URL:** `/auth/register`
- **Method:** POST
- **Body:**

```json
{
  "username": "yourusername",
  "password": "yourpassword"
}
```

- **Responses:**
  - `201 Created` with user id and username on success
  - `400 Bad Request` on validation errors
  - `409 Conflict` if username already exists

### Login

- **URL:** `/auth/login`
- **Method:** POST
- **Body:**

```json
{
  "username": "yourusername",
  "password": "yourpassword"
}
```

- **Responses:**
  - `200 OK` with success message on valid login
  - `400 Bad Request` if missing fields
  - `401 Unauthorized` on invalid credentials

### Logout

- **URL:** `/auth/logout`
- **Method:** POST
- **Response:**
  - `200 OK` on successful logout

### Get Current User

- **URL:** `/auth/me`
- **Method:** GET
- **Response:**
  - `200 OK` with user info if logged in
  - `401 Unauthorized` if not logged in

## Code Overview

- `init-db.js` - initializes the SQLite database and creates the users table
- `controllers/AuthController.js` - handles registration, login, logout, and current user routes
- `db.js` - SQLite database connection (not shown in snippet, but required)
- `server.js` (or equivalent) - Express server setup with session middleware and routes (not shown in snippet)

## Security Notes

- Passwords are hashed with bcrypt before storage.
- Username uniqueness is enforced at the database level.
- Sessions are managed securely (configure session secret).
