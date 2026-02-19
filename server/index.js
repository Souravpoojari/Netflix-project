require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || CLIENT_URL,
    credentials: false,
  })
);

// Serve static assets (optional, for shared CSS/images)
app.use('/static', express.static(path.join(__dirname, 'public')));

// Helper to create JWT token
function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Redirect root to login page so / shows UI
app.get('/', (req, res) => {
  res.redirect('/login');
});

// --- JSON API ENDPOINTS (for programmatic access) ---

app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  db.getUserByEmail(normalizedEmail, (err, existing) => {
    if (err) {
      console.error('Error checking user', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (existing) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    db.createUser(
      { name: name.trim(), email: normalizedEmail, passwordHash },
      (insertErr, newUser) => {
        if (insertErr) {
          console.error('Error creating user', insertErr);
          return res.status(500).json({ message: 'Failed to create user' });
        }

        const token = createToken(newUser);
        return res.status(201).json({
          message: 'Registration successful',
          token,
          user: { id: newUser.id, name: newUser.name, email: newUser.email },
        });
      }
    );
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  db.getUserByEmail(normalizedEmail, (err, user) => {
    if (err) {
      console.error('Error fetching user', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatches = bcrypt.compareSync(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = createToken(user);
    return res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  });
});

// --- EXTERNAL LOGIN / REGISTER PAGES ---

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// Form-based registration
app.post('/auth/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send('All fields are required. <a href="/register">Go back</a>');
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  db.getUserByEmail(normalizedEmail, (err, existing) => {
    if (err) {
      console.error('Error checking user', err);
      return res.status(500).send('Internal server error');
    }

    if (existing) {
      return res.status(400).send('User already exists with this email. <a href="/login">Login</a>');
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    db.createUser(
      { name: name.trim(), email: normalizedEmail, passwordHash },
      (insertErr) => {
        if (insertErr) {
          console.error('Error creating user', insertErr);
          return res.status(500).send('Failed to create user');
        }

        return res.redirect('/login?registered=1');
      }
    );
  });
});

// Form-based login that redirects to the Netflix app
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and password are required. <a href="/login">Go back</a>');
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  db.getUserByEmail(normalizedEmail, (err, user) => {
    if (err) {
      console.error('Error fetching user', err);
      return res.status(500).send('Internal server error');
    }

    if (!user) {
      return res.status(401).send('Invalid email or password. <a href="/login">Try again</a>');
    }

    const passwordMatches = bcrypt.compareSync(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).send('Invalid email or password. <a href="/login">Try again</a>');
    }

    // We could set a cookie here; for now just redirect to the client app
    return res.redirect(CLIENT_URL);
  });
});

app.listen(PORT, () => {
  console.log(`Auth server running on http://localhost:${PORT}`);
  console.log(`Login page: http://localhost:${PORT}/login`);
  console.log(`Register page: http://localhost:${PORT}/register`);
});

