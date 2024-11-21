const express = require('express')
const { createRoles } = require('../controller/role.js')
const roleRouter = express.Router()

roleRouter.post('/', createRoles)


module.exports = roleRouter