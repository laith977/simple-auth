import bcrypt from 'bcryptjs';
import db from '../db.js';

class AuthController {
  async register(req, res) {
    const user = req.body;
    const username = user?.username;
    const password = user?.password;
    const errors = [];

    // Validation
    if (!username) {
      errors.push({ username: 'Username is required' });
    } else if (username.length < 8) {
      errors.push({ username: 'Username must be at least 8 characters long' });
    } else if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(username)) {
      errors.push({
        username:
          'Username must start with a letter and contain only letters and numbers',
      });
    }

    if (!password) {
      errors.push({ password: 'Password is required' });
    } else if (typeof password !== 'string') {
      errors.push({ password: 'Password must be a string' });
    } else if (password.length < 8) {
      errors.push({ password: 'Password must be at least 8 characters long' });
    }
    if (errors.length > 0) return res.status(400).json({ errors });

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    db.run(
      `INSERT INTO users (username, password) VALUES (?, ?)`,
      [username, passwordHash],
      function (err) {
        if (err) {
          if (
            err.code === 'SQLITE_CONSTRAINT' &&
            err.message.includes('users.username')
          ) {
            return res.status(409).json({ error: 'Username already taken' });
          }
          return res.status(500).json({ error: 'Database error' });
        }
        req.session.userId = this.lastID;
        res.status(201).json({ id: this.lastID, username });
      }
    );
  }

  async login(req, res) {
    const user = req.body;
    const username = user?.username;
    const password = user?.password;
    const errors = [];

    if (!username) errors.push({ username: 'Username is required' });
    if (!password) errors.push({ password: 'Password is required' });
    if (errors.length > 0) return res.status(400).json({ errors });

    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (!row)
        return res.status(401).json({ error: 'Invalid username or password' });

      const isPasswordValid = bcrypt.compareSync(password, row.password);
      if (!isPasswordValid)
        return res.status(401).json({ error: 'Invalid username or password' });

      req.session.userId = row.id;
      res.status(200).json({ message: 'Login successful', username });
    });
  }

  async logout(req, res) {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ error: 'Logout failed' });
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Logged out' });
    });
  }

  async currentUser(req, res) {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });

    db.get(
      `SELECT id, username FROM users WHERE id = ?`,
      [userId],
      (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!row) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(row);
      }
    );
  }
}

export default new AuthController();
