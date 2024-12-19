const express = require('express')
const { createPermissions, getPermissions,deletePermissionbyId, updatePermissionById } = require('../controller/permissions.js')
const permissionsRouter = express.Router()

permissionsRouter.post('/:id?', createPermissions)

permissionsRouter.get('/', getPermissions)
permissionsRouter.delete('/:id', deletePermissionbyId)

// permissionsRouter.put('/:id', updatePermissionById)


module.exports = permissionsRouter