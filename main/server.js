const express = require('express');
const path = require('path');

const app = express();
const port = 4000;

// Serve the files from the 'frc-betting' folder
app.use(express.static(path.join(__dirname, 'frc-betting')));

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
