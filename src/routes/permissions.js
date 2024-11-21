const express = require('express')
const { createPermissions, getPermissions } = require('../controller/permissions.js')
const permissionsRouter = express.Router()

permissionsRouter.post('/', createPermissions)
permissionsRouter.get('/', getPermissions)

module.exports = permissionsRouter