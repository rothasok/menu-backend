
const asyncHandler = require('express-async-handler')
const permissionsModel = require('../models/permissions.js')
const redisClient = require('../redis/index.js')

/**
 * Controller is a specific function to handle specific tasks
 */

const createPermissions = asyncHandler(async (req, res) => {
    const prms = new permissionsModel(req.body)
    const result = await prms.save()
    // Invalidate Cache
    // const { baseUrl } = req
    // const keys = await redisClient.keys(`${baseUrl}*`)
    // redisClient.del(keys[0])
    return res.json(result)
})

const getPermissions = asyncHandler(async (req, res) => {
    // Get all permissions
    const perms = await permissionsModel.find()
    return res.json(perms)
})

module.exports = {
    createPermissions,
    getPermissions,
}