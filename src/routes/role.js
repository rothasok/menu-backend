const express = require('express')
const { createRoles, getRoles } = require('../controller/role.js')
const roleRouter = express.Router()

roleRouter.post('/', createRoles)
roleRouter.get('/', getRoles)


module.exports = roleRouter