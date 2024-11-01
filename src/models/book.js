const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const bookSchema = new mongoose.Schema({
    title: {
        type: String, required: true
    },
    genre: {
        type: String, required: true
    },
    author: { type: mongoose.Types.ObjectId, ref: 'Users' },
    page: { type: Number, required: true },
    description: {
        type: String,
        required: true
    },
    createdDate: { type: Date, required: true, default: new Date() },
    covers: [{ type: mongoose.Types.ObjectId, ref: 'Files' }]
})
bookSchema.plugin(mongoosePaginate)

bookSchema.index(
    {
        description: 'text',
        genre: 'text',
        title: 'text'
    }
)

const BookModel = mongoose.model('Books', bookSchema)

module.exports = BookModel