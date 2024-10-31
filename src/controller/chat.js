const asyncHandler = require('express-async-handler')
const ChatModel = require('../models/chat')

const getChats = asyncHandler(async (req, res) => {
    const chats = await ChatModel.find().populate('byUser')
    return res.json(chats)
})

module.exports = { getChats }