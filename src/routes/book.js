const express = require('express');
const {
  createBook,
  getBooks,
  getBookById,
  deleteBookbyId,
  updateBookById,
} = require('../controller/book');
const { permission } = require('../middlewares');
const { actions } = require('../models/permission');

const bookRouter = express.Router();

bookRouter.post('/', permission(actions.CREATE_BOOK), createBook);
bookRouter.get('/', permission(actions.READ_BOOK), getBooks);
// bookRouter.get('/', getBooks);
bookRouter.get('/:id', permission(actions.READ_BOOK), getBookById);
bookRouter.delete('/:id', permission(actions.DELETE_BOOK), deleteBookbyId);
bookRouter.put('/:id', permission(actions.EDIT_BOOK), updateBookById); 

module.exports = bookRouter;