
const asyncHandler = require('express-async-handler')
const OwnerModel = require('../models/owner.js')
const redisClient = require('../redis/index.js')
const { claimTokenData } = require('../utils/index.js')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { signJWT } = require('../utils')
/**
 * Controller is a specific function to handle specific tasks
 */

const registerAccount = asyncHandler(async (req, res) => {
    const { password, confirmPassword } = req.body;
    const id = req.params.id;

    if (!id) {
        console.log("Creating new user...");

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match." });
        }

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);

        const usr = new OwnerModel(req.body);
        const result = await usr.save();
        return res.json(result);
    } else {
        console.log("Updating existing user...");

        const existingUser = await OwnerModel.findById(id);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found." });
        }

        // If updating password, check if new passwords match
        if (req.body.newPassword && req.body.confirmPassword) {
            if (req.body.newPassword !== req.body.confirmPassword) {
                return res.status(400).json({ message: "Passwords do not match." });
            }

            // Hash the new password
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.newPassword, salt);
        }

        // Update user
        await OwnerModel.updateOne({ _id: id }, req.body);
        return res.json({ message: "User updated successfully." });
    }
});


const login = asyncHandler(async (req, res) => {
    const { phone, password } = req.body
    const user = await OwnerModel.findOne({ phone: phone })

    if (!user) {
        return res.status(404).json("User not found!")
    }
    if (user.active !== 1) {
        return res.status(403).json("Account is inactive. Please contact support.");
      }
    
    const compareResult = await bcrypt.compare(password, user.password)


    if (!compareResult) {
        return res.status(401).json("Incorrect phone number or password")

    }
    console.log(user)
    // Sign JWT Token
    const token = signJWT(user._id, user.email, user.username)

    // Save refresh in database

    const hashedToken = await bcrypt.hash(token.refreshToken, 10)

    user.refreshToken = hashedToken
    user.save()

    return res.json(token)
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
   
    const result = await OwnerModel.updateOne({ _id: id }, { password: pwd });

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
    const user = await OwnerModel.findById(id);

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

const toggleUserStatus = async (req, res) => {

    try {
      const userId = req.params.id; 
    
      const user = await OwnerModel.findById(userId); 
  
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
//     const user = new OwnerModel({
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
    const user = await OwnerModel.findById(id);
    return res.json(user);
});



const getUserbyToken = asyncHandler(async (req, res) => {
    //const user = await OwnerModel.findOne({ email: email })
    const userId = claimTokenData(req)['id'];
    // const user = await OwnerModel.findById(userId).populate('role')
    const user = await OwnerModel.findById(userId)
        // .populate({
        //     path: 'role',
        //     populate: {
        //         path: 'permissions',
        //         model: 'Permissions', // Replace with the actual model name for permissions
        //     },
        // });

    if (!user) {
        return res.status(404).json("User not found!")
    }
    return res.json(user)
})



const getUsers = asyncHandler(async (req, res) => {
    // Get all courses 
    const courses = await OwnerModel.find()
    .populate({
        path: 'role', // Reference field in User schema
        select: '_id roleName'
    });
    return res.json(courses)
})

const deleteUserById = asyncHandler(async (req, res) => {
    const id = req.params.id.trim();
    const result = await OwnerModel.deleteOne({ _id: id })
    return res.json(result)
})

const updateUserById = asyncHandler(async (req, res) => {
    const id = req.params.id
    const result = await OwnerModel.updateOne({ _id: id }, req.body)
    return res.json(result)
})
module.exports = {
    registerAccount,
    login,
    getUserById,
    getUsers,
    deleteUserById,
    updateUserById,
    getUserbyToken,
    resetPassword,
    toggleUserStatus,
    changePassword
}