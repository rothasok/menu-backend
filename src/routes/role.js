const express = require('express')
const { createRoles, getRoles,deleteRolebyId, } = require('../controller/role.js')
const roleRouter = express.Router()

roleRouter.post('/:id?', createRoles)

roleRouter.get('/', getRoles)
roleRouter.delete('/:id', deleteRolebyId)

module.exports = roleRouter