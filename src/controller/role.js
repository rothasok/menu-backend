
const asyncHandler = require('express-async-handler')
const RoleModel = require('../models/role.js')
const redisClient = require('../redis/index.js')

/**
 * Controller is a specific function to handle specific tasks
 */

const createRoles = asyncHandler(async (req, res) => {
    const rle = new RoleModel(req.body)
    const id=req.params.id;
    let result;
    if (!id){
        console.log("Creating new permission...");
        result = await rle.save()   
    }else
        {
            console.log("Updating existing permission...");
            result = await RoleModel.updateOne({ _id: id }, req.body);
        }
    return res.json(result);
   
})

const getRoles = asyncHandler(async (req, res) => {
    
    const rle = await RoleModel.find()
    return res.json(rle)
})

const deleteRolebyId = asyncHandler(async (req, res) => {
    const id = req.params.id
    const result = await RoleModel.deleteOne({ _id: id })
    return res.json(result)
})

module.exports = {
    createRoles,
    getRoles,
    deleteRolebyId,
}