const express = require('express');
const { createBook, getBooks, getBookById, deleteBookbyId, updateBookById } = require('../controller/book');
const bookRouter = express.Router();

bookRouter.post('/', createBook)
bookRouter.get('/', getBooks)
bookRouter.get('/:id', getBookById)
bookRouter.delete('/:id', deleteBookbyId)
bookRouter.put('/:id', updateBookById)

module.exports = bookRouter