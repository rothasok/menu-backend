const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    text: { type: String, required: true },
    byUser: { type: mongoose.Types.ObjectId, ref: 'Users' },
    createdDate: { type: Date, required: true, default: new Date() },
})

const ChatModel = mongoose.model('Chats', chatSchema)

module.exports = ChatModel