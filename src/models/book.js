const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    genre: { type: String, required: true },
    author: { type: mongoose.Types.ObjectId, ref: 'Users' },
    page: { type: Number, required: true },
    description: { type: String, required: true },
    createdDate: { type: Date, required: true, default: new Date() },
})

const BookModel = mongoose.model('Books', bookSchema)

module.exports = BookModel