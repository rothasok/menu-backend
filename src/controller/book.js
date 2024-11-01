
const asyncHandler = require('express-async-handler')
const BookModel = require('../models/book.js')
const redisClient = require('../redis/index.js')

/**
 * Controller is a specific function to handle specific tasks
 */

const createBook = asyncHandler(async (req, res) => {
    const course = new BookModel(req.body)
    const result = await course.save()
    // Invalidate Cache
    // const { baseUrl } = req
    // const keys = await redisClient.keys(`${baseUrl}*`)
    // redisClient.del(keys[0])
    return res.json(result)
})

const getBookById = asyncHandler(async (req, res) => {
    const id = req.params.id
    const course = await BookModel.findById(id)
    return res.json(course)
})

const getBooks = asyncHandler(async (req, res) => {
    const { limit, page } = req.query
    const options = {
    //    limit: limit ? limit : -1,
    //     page: page ? page : -1,
        pagination: limit ? true : false
    }
    console.log(options)
    const { join } = req.query
    // Get all books
   // const books = await BookModel.find().populate(join)
    //  return res.json(books)

     
     const books = await BookModel.paginate({}, options)
     return res.json(books)
})

const deleteBookbyId = asyncHandler(async (req, res) => {
    const id = req.params.id
    const result = await BookModel.deleteOne({ _id: id })
    return res.json(result)
})

const updateBookById = asyncHandler(async (req, res) => {
    const id = req.params.id
    const result = await BookModel.updateOne({ _id: id }, req.body)
    return res.json(result)
})

module.exports = {
    createBook,
    getBookById,
    getBooks,
    deleteBookbyId,
    updateBookById
}