const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  if (username) {
    return true
  }
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  return true;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body

  if (!isValid(username) || !password) {
    return res.status(400).json({ message: "Invalid username or password." });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Authentication failed: Invalid credentials." });
  }

  const token = jwt.sign({ username }, '9$1!2978*92#', { expiresIn: '1h' });
  return res.status(200).json({ message: "Login successful.", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params
  const { review } = req.body
  const token = req.headers['authorization']
  const { username } = jwt.decode(token);

  if (!review) {
    return res.status(400).json({ message: "Review content is required" })
  }
  const book = books.find((book) => book.isbn === isbn)
  if (!book) {
    return res.status(404).json({ message: "Book not found" })
  }
  book.reviews.push({ review })
  return res.status(200).json({ message: "Review Added Successfully" })
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
