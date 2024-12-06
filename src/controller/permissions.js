
const asyncHandler = require('express-async-handler')
const permissionsModel = require('../models/permissions.js')
const redisClient = require('../redis/index.js')

/**
 * Controller is a specific function to handle specific tasks
 */

const createPermissions = asyncHandler(async (req, res) => {
    const prms = new permissionsModel(req.body);
    const id = req.params.id;
    let result; // Define result outside the if-else blocks

    if (!id) {
        console.log("Creating new permission...");
        result = await prms.save(); // Assign the result
    } else {
        console.log("Updating existing permission...");
        result = await permissionsModel.updateOne({ _id: id }, req.body); // Assign the result
    }

    res.status(200).json({ message: 'Operation successful', data: result });
});



    // Invalidate Cache
    // const { baseUrl } = req
    // const keys = await redisClient.keys(`${baseUrl}*`)
    // redisClient.del(keys[0])
//     return res.json(result)
// })

const getPermissions = asyncHandler(async (req, res) => {
    // Get all permissions
    const perms = await permissionsModel.find()
    return res.json(perms)
})

const deletePermissionbyId = asyncHandler(async (req, res) => {
    const id = req.params.id
    const result = await permissionsModel.deleteOne({ _id: id })
    return res.json(result)
})

const updatePermissionById = asyncHandler(async (req, res) => {
    const id = req.params.id
    const result = await permissionsModel.updateOne({ _id: id }, req.body)
    return res.json(result)
})

module.exports = {
    createPermissions,
    getPermissions,
    deletePermissionbyId,
    // updatePermissionById
}