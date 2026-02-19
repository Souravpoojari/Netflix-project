const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'users.json');

function readUsers() {
  try {
    if (!fs.existsSync(dbPath)) {
      return [];
    }
    const raw = fs.readFileSync(dbPath, 'utf8');
    if (!raw.trim()) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read users.json', e);
    return [];
  }
}

function writeUsers(users) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to write users.json', e);
  }
}

function getUserByEmail(email, cb) {
  try {
    const users = readUsers();
    const user = users.find((u) => u.email === email) || null;
    cb(null, user);
  } catch (err) {
    cb(err);
  }
}

function createUser({ name, email, passwordHash }, cb) {
  try {
    const users = readUsers();
    if (users.find((u) => u.email === email)) {
      return cb(new Error('User already exists'));
    }
    const id = users.length ? users[users.length - 1].id + 1 : 1;
    const user = {
      id,
      name,
      email,
      password_hash: passwordHash,
      created_at: new Date().toISOString(),
    };
    users.push(user);
    writeUsers(users);
    cb(null, user);
  } catch (err) {
    cb(err);
  }
}

module.exports = {
  getUserByEmail,
  createUser,
};


