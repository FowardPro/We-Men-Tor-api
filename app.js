require('dotenv').config(); // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connection = require('./config/config'); // Import MySQL connection

const app = express();
const port = process.env.PORT || 5000; // Fallback to port 5000 if PORT is not defined

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password' });
  }

  const query = 'SELECT * FROM user WHERE email = ?';
  connection.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length > 0) {
      const user = results[0];

      // Directly compare the provided password with the stored password (should use hashing in production)
      if (password === user.password) {
        res.json({ message: 'Login successful', user });
      } else {
        res.status(401).json({ error: 'Invalid email or password' });
      }
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  });
});
app.post('/api/register', (req, res) => {
    const { firstName, lastName, studentEmail, contactNumber, password } = req.body;
  
    if (!firstName || !lastName || !studentEmail || !contactNumber || !password) {
      return res.status(400).json({ error: 'Please provide all the required fields' });
    }
  
    const query = 'INSERT INTO user (first_name, last_name, email, contact_number, password) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [firstName, lastName, studentEmail, contactNumber, password], (err, results) => {
      if (err) {
        console.error('Error inserting into the database:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json({ message: 'Registration successful', userId: results.insertId });
    });
  });
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
