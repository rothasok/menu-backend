
const asyncHandler = require('express-async-handler')
const UserModel = require('../models/user.js')
const redisClient = require('../redis/index.js')
const { claimTokenData } = require('../utils')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
/**
 * Controller is a specific function to handle specific tasks
 */

const createUser = asyncHandler(async (req, res) => {
    console.log("test")
    const usr = new UserModel(req.body)
    const id=req.params.id;
    if (!id){
        console.log("Creating new user...");
        result = await usr.save()   
    }else
        {
            console.log("Updating existing permission...");
            result = await usr.updateOne({ _id: id }, req.body);
        }
    return res.json(result);
})



const resetPassword = asyncHandler(async (req, res) => {
   
    const { id, newPassword, confirmPassword } = req.body; 
    if (!id || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required." });
    }
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
    }
   
    let pwd =await bcrypt.hash(newPassword, 10);
   
    const result = await UserModel.updateOne({ _id: id }, { password: pwd });

    if (result.matchedCount === 0) {
        return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ message: "Password has been reset successfully." });
});


const changePassword = asyncHandler(async (req, res) => {
    const { id, oldPassword, newPassword } = req.body; 

    if (!id || !oldPassword || !newPassword) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Fetch the user
    const user = await UserModel.findById(id);

    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }

    // Verify the old password
    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Old password is incorrect." });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({ message: "Password has been reset successfully." });
});



const setuserRole = asyncHandler(async (req, res) => {
    const { id, role } = req.body;
   
    const result = await UserModel.updateOne({ _id: id }, {role: role });
    if (result.matchedCount === 0) {
        return res.status(404).json({ message: "User not found." });
    }
    return res.json(result)
})


const toggleUserStatus = async (req, res) => {

    try {
      const userId = req.params.id; 
    
      const user = await UserModel.findById(userId); 
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      user.active = user.active === 1 ? 0 : 1;
      await user.save();
  
      res.status(200).json({ 
        message: "User status updated successfully", 
        active: user.active 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  



// const createUser = asyncHandler(async (req, res) => {
//   try {
//     const { 
//       username, 
//       firstname, 
//       lastname, 
//       dateOfBirth, 
//       email, 
//       createdDate, 
//       password, 
//       refreshToken, 
//       type, 
//       permissions 
//     } = req.body;

//     // Validate and convert the permissions string to ObjectId
//     if (!mongoose.Types.ObjectId.isValid(permissions)) {
//       throw new Error('Invalid permissions ObjectId');
//     }
//     // const permissionsObjectId = mongoose.Types.ObjectId(permissions);

//     // Create a new user instance
//     const user = new UserModel({
//       username,
//       firstname,
//       lastname,
//       dateOfBirth: dateOfBirth || new Date(), // Default to current date if not provided
//       email,
//       createdDate: createdDate || new Date(), // Default to current date if not provided
//       password,
//       refreshToken,
//       type: type || 'PW', // Default to 'PW' if not provided
//       permissions: '673dfbf9fc98ea530e09a888', // Store the ObjectId for permissions
//     });

//     // Save the user to the database
//     const result = await user.save();

//     return res.status(201).json(result);
//   } catch (error) {
//     return res.status(400).json({ message: error.message });
//   }
// });




const getUserById = asyncHandler(async (req, res) => {
    const id = req.params.id.trim();
    console.log("Requested ID:", id);
    const user = await UserModel.findById(id);
    return res.json(user);
});



const getUserbyToken = asyncHandler(async (req, res) => {
    //const user = await UserModel.findOne({ email: email })
    const userId = claimTokenData(req)['id'];
    // const user = await UserModel.findById(userId).populate('role')
    const user = await UserModel.findById(userId)
        .populate({
            path: 'role',
            populate: {
                path: 'permissions',
                model: 'Permissions', // Replace with the actual model name for permissions
            },
        });

    if (!user) {
        return res.status(404).json("User not found!")
    }
    return res.json(user)
})



const getUsers = asyncHandler(async (req, res) => {
    // Get all courses 
    const courses = await UserModel.find()
    .populate({
        path: 'role', // Reference field in User schema
        select: '_id roleName'
    });
    return res.json(courses)
})

const deleteUserById = asyncHandler(async (req, res) => {
    const id = req.params.id.trim();
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
    getUserbyToken,
    resetPassword,
    setuserRole,
    toggleUserStatus,
    changePassword
}