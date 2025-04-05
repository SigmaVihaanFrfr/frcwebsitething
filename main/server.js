const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from the 'frc-betting' folder
app.use(express.static(path.join(__dirname, 'frc-betting')));

// Connect to MongoDB
const mongoURI = 'mongodb://localhost:27017/frc-betting'; // Update if using a cloud database
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define Mongoose schema and model
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 1000 },
});
const User = mongoose.model('User', UserSchema);

// Signup Endpoint
app.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Username already taken" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Login Endpoint
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        res.json({ success: true, message: "Login successful", user: { username, balance: user.balance } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Define routes for each HTML file
app.get('/account', (req, res) => {
    res.sendFile(path.join(__dirname, 'frc-betting', 'account.html'));
});

app.get('/homepage', (req, res) => {
    res.sendFile(path.join(__dirname, 'frc-betting', 'homepage.html'));
});

app.get('/templatepage', (req, res) => {
    res.sendFile(path.join(__dirname, 'frc-betting', 'templatepage.html'));
});

app.get('/templatepage2', (req, res) => {
    res.sendFile(path.join(__dirname, 'frc-betting', 'templatepage2.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
