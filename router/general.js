const express = require('express');
let books = require("./booksdb.js");
const e = require('express');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// registered user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body // request body from user input
  if (!username || !password) {
    return res.status(400).json({ message: "Username and Password are required" })
  }
  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username" })
  }
  if (users.some(user => user.username === username)) {
    return res.status(401).json({ message: "Username already taken" });
  }
  users.push({ username, password })
  return res.status(200).json({ message: "User registered successfully" })
});

// public_users.get('/', async (req, res) => {
//   const allbooks = await new Promise((resolve, reject) => {
//     resolve(books)
//   })
//   res.status(200).json(allbooks)
//   res.json({message: "Get All Book"})
// })

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  const bookList = books
  return res.status(200).json(bookList)
});

// using async function
// public_users.get('/author/:author', async (req, res) => {
//   const author = req.params.author
//   const allbooks = await new Promise((resolve, reject) => {
//     resolve(getBooksByAuthor(author))
//   })
//   if(author){
//     return res.status(200).json(allbooks);
//   }
// })
// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn
  const book = findISBN(isbn)
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: 'Book not found.' });
  }
});

function findISBN(isbn) {
  for (const bookId in books) {
    if (books.hasOwnProperty(bookId) && books[bookId].isbn === isbn) {
      return books[bookId]
    }
  }
  return null;
}

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const booksByAuthor = getBooksByAuthor(author);

  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: 'No books found for the provided author.' });
  }
});

function getBooksByAuthor(author) {
  const booksByAuthor = [];
  for (const bookId in books) {
    if (books.hasOwnProperty(bookId) && books[bookId].author === author) {
      booksByAuthor.push(books[bookId]);
    }
  }
  return booksByAuthor;
}


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title
  const booksByTitle = findTitle(title)
  if (title.length > 0) {
    return res.status(200).json(booksByTitle)
  } else {
    return res.status(404).json({ message: "Book not Found" })
  }
});

function findTitle(title) {
  const booksByTitle = []
  for (const bookId in books) {
    if (books.hasOwnProperty(bookId) && books[bookId].title === title) {
      booksByTitle.push(books[bookId])
    }
  }
  return booksByTitle
}

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const bookReview = req.params.isbn
  const response = bookReviews(bookReview)
  if (response) {
    return res.status(200).json(response)
  }
  else {
    return res.status(404).json({ message: "ISBN not found" })
  }
});

function bookReviews(isbn) {
  const review = []
  for (const bookId in books) {
    if (books.hasOwnProperty(bookId) && books[bookId].isbn === isbn) {
      review.push(books[bookId].reviews)
    }
  }
  return review
}

module.exports.general = public_users;
