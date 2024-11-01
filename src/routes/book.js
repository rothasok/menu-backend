const express = require('express');
const { createBook, getBooks, getBookById, deleteBookbyId, updateBookById } = require('../controller/book');
const bookRouter = express.Router();

const { validation } = require('swagger-generator-express');
const requestModel = require('../models/request/book')

bookRouter.post('/', validation(requestModel[0]), createBook)
bookRouter.get('/', getBooks)
bookRouter.get('/:id', getBookById)
bookRouter.delete('/:id', deleteBookbyId)
bookRouter.put('/:id', updateBookById)

module.exports = bookRouter