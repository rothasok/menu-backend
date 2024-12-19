const express = require('express')
const { getChats } = require('../controller/chat')
const chatRouter = express.Router()


chatRouter.get('/', getChats) 


module.exports = chatRouter