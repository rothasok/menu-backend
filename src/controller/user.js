
const asyncHandler = require('express-async-handler')
const UserModel = require('../models/user.js')
const redisClient = require('../redis/index.js')
const { claimTokenData } = require('../utils')
const mongoose = require('mongoose');
/**
 * Controller is a specific function to handle specific tasks
 */

// const createUser = asyncHandler(async (req, res) => {
//     const usr = new UserModel(req.body)
//     const result = await usr.save()
//     // Invalidate Cache
//     // const { baseUrl } = req
//     // const keys = await redisClient.keys(`${baseUrl}*`)
//     // redisClient.del(keys[0])
//     return res.json(result)
// })


const createUser = asyncHandler(async (req, res) => {
  try {
    const { 
      username, 
      firstname, 
      lastname, 
      dateOfBirth, 
      email, 
      createdDate, 
      password, 
      refreshToken, 
      type, 
      permissions 
    } = req.body;

    // Validate and convert the permissions string to ObjectId
    if (!mongoose.Types.ObjectId.isValid(permissions)) {
      throw new Error('Invalid permissions ObjectId');
    }
    const permissionsObjectId = new mongoose.Types.ObjectId(permissions);

    // Create a new user instance
    const user = new UserModel({
      username,
      firstname,
      lastname,
      dateOfBirth: dateOfBirth || new Date(), // Default to current date if not provided
      email,
      createdDate: createdDate || new Date(), // Default to current date if not provided
      password,
      refreshToken,
      type: type || 'PW', // Default to 'PW' if not provided
      permissions: permissionsObjectId, // Store the ObjectId for permissions
    });
 
    // Save the user to the database
    const result = await user.save();

    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});




const getUserById = asyncHandler(async (req, res) => {
    const id = req.params.id
    const user = await UserModel.findById(id)
    return res.json(user)
})


const getUserbyToken = asyncHandler(async (req, res) => {
    //const user = await UserModel.findOne({ email: email })
    const userId = claimTokenData(req)['id'];
    const user = await UserModel.findById(userId)
    if (!user) {
        return res.status(404).json("User not found!")
    }
    return res.json(user)
})



const getUsers = asyncHandler(async (req, res) => {
    // Get all courses 
    const courses = await UserModel.find()
    return res.json(courses)
})

const deleteUserById = asyncHandler(async (req, res) => {
    const id = req.params.id
    const result = await UserModel.deleteOne({ _id: id })
    return res.json(result)
})

const updateUserById = asyncHandler(async (req, res) => {
    const id = req.params.id
    const result = await UserModel.updateOne({ _id: id }, req.body)
    return res.json(result)
})

module.exports = {
    createUser,
    getUserById,
    getUsers,
    deleteUserById,
    updateUserById,
    getUserbyToken
}