const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });

  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Task 10: Get the list of books available in the shop using Promise callbacks
function getBookList() {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
}

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  getBookList().then(
    (bk) => res.send(JSON.stringify(bk, null, 4)),
    (error) => res.send("denied")
  );
});

// Task 11: Get book details based on ISBN using Promise callbacks
function getFromISBN(isbn) {
  let book_ = books[isbn];
  return new Promise((resolve, reject) => {
    if (book_) {
      resolve(book_);
    } else {
      reject("Unable to find book!");
    }
  });
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  getFromISBN(isbn).then(
    (bk) => res.send(JSON.stringify(bk, null, 4)),
    (error) => res.send(error)
  );
});

// Task 12: Get book details based on Author using Promise callbacks
function getFromAuthor(author) {
  let output = [];
  return new Promise((resolve, reject) => {
    for (var isbn in books) {
      let book_ = books[isbn];
      if (book_.author === author) {
        output.push(book_);
      }
    }
    resolve(output);
  });
}

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  getFromAuthor(author)
  .then(
    result => res.send(JSON.stringify(result, null, 4))
  );
});

// Task 13: Get all books based on title using Promise callbacks
function getFromTitle(title) {
  let output = [];
  return new Promise((resolve, reject) => {
    for (var isbn in books) {
      let book_ = books[isbn];
      if (book_.title === title) {
        output.push(book_);
      }
    }
    resolve(output);
  });
}

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  getFromTitle(title)
  .then(
    result => res.send(JSON.stringify(result, null, 4))
  );
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const ISBN = req.params.isbn;
  res.send(books[ISBN].reviews);
});

module.exports.general = public_users;
