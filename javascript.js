const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const USERS_FILE = 'users.json';

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
``
// Load users from the file
function loadUsers() {
    if (fs.existsSync(USERS_FILE)) {
        const data = fs.readFileSync(USERS_FILE);
        return JSON.parse(data);
    }
    return {};
}

// Save users to the file
function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signinup.html'));
});

app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    const users = loadUsers();

    if (users[email]) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }

    users[email] = { name, password };
    saveUsers(users);

    res.json({ success: true });
});

app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    const users = loadUsers();

    if (users[email] && users[email].password === password) {
        return res.json({ success: true });
    } else {
        return res.status(400).json({ success: false, message: 'Invalid username or password' });
    }
});

app.get('/main2', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main2.html'));
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
