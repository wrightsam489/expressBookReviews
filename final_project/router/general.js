const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body["username"];
  const password = req.body["password"];

  if (username == "" && password == "") {
    return res
      .status(400)
      .json({ message: "Username and password must be provided." });
  } else if (username == "") {
    return res.status(400).json({ message: "Username must be provided." });
  } else if (password == "") {
    return res.status(400).json({ message: "Password must be provided." });
  }

  if (users.filter((item) => item.username == username).length > 0) {
    return res.status(400).json({ message: "Username is already in use." });
  }

  users.push({ username: username, password: password });

  return res.status(200).json({ message: "Registered new user successful" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  if (!Object.hasOwn(books, isbn)) {
    return res.status(400).json({ message: "Invalid ISBN" });
  }

  const book = books[isbn];
  return res.status(200).json(book);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;

  const filtered_books = Object.values(books).filter((book) => {
    return book.author.includes(author);
  });
  return res.status(200).json(filtered_books);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;

  const filtered_books = Object.values(books).filter((book) => {
    return book.title.includes(title);
  });
  return res.status(200).json(filtered_books);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  if (!Object.hasOwn(books, isbn)) {
    return res.status(400).json({ message: "Invalid ISBN" });
  }

  const reviews = books[isbn].reviews;

  return res.status(200).json(reviews);
});

module.exports.general = public_users;
