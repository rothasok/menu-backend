
const asyncHandler = require('express-async-handler')
const RoleModel = require('../models/role.js')
const redisClient = require('../redis/index.js')

/**
 * Controller is a specific function to handle specific tasks
 */

const createRoles = asyncHandler(async (req, res) => {
    const rle = new RoleModel(req.body)
    const result = await rle.save()
    // Invalidate Cache
    // const { baseUrl } = req
    // const keys = await redisClient.keys(`${baseUrl}*`)
    // redisClient.del(keys[0])
    return res.json(result)
})

module.exports = {
    createRoles,
}