
const asyncHandler = require('express-async-handler')
const OwnerModel = require('../models/owner.js')
const redisClient = require('../redis/index.js')
const { claimTokenData } = require('../utils/index.js')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { signJWT, signJWTOwner } = require('../utils')
/**
 * Controller is a specific function to handle specific tasks
 */

// Controller to get user profile by ID
const getOwnerProfile = asyncHandler(async (req, res) => {
    const userId = req.params.id;  // Getting user ID from the request parameters

    // Find the user by ID
    const user = await OwnerModel.findById(userId);

    // Check if user exists
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Respond with the user's profile (first name, last name, phone)
    return res.json({
        firstName: user.firstname,
        lastName: user.lastname,
        phone: user.phone
    });
});



// const getAllOwners = asyncHandler(async (req, res) => {
//     try {
//         const owners = await OwnerModel.find({}, "firstname lastname phone role");

//         // Map through owners and assign role names
//         const ownersWithRoles = owners.map(owner => ({
//             name: `${owner.firstname} ${owner.lastname}`.trim(),
//             phone: owner.phone,
//             role: owner.role === 1 ? "Owner" : owner.role === 2 ? "Admin" : "Unknown"
//         }));

//         res.json(ownersWithRoles);
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// });

const getAllOwners = asyncHandler(async (req, res) => {
    try {
        // Get page and limit from query parameters (default to page 1, limit 10)
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skip = (page - 1) * limit;

        // Fetch owners with pagination
        // const owners = await OwnerModel.find({}, "firstname lastname phone role")
        const owners = await OwnerModel.find({ active: 1 }, "firstname lastname phone role")
            .skip(skip)
            .limit(limit);

        // Map through owners and assign role names
        const ownersWithRoles = owners.map(owner => ({
            name: `${owner.firstname} ${owner.lastname}`.trim(),
            phone: owner.phone,
            role: owner.role === 1 ? "Owner" : owner.role === 2 ? "Admin" : "Unknown",
            id: owner.id,
        }));

        // Get total count for frontend pagination
        const totalOwners = await OwnerModel.countDocuments();

        res.json({
            currentPage: page,
            totalPages: Math.ceil(totalOwners / limit),
            totalOwners,
            owners: ownersWithRoles
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

const deactivateOwner = asyncHandler(async (req, res) => {
    try {
        const ownerId = req.params.id;
        const owner = await OwnerModel.findByIdAndUpdate(ownerId, { active: 0 }, { new: true });

        if (!owner) {
            return res.status(404).json({ message: "Owner not found" });
        }

        res.json({ message: "Owner deactivated successfully", owner });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

const searchOwners = asyncHandler(async (req, res) => {
    try {
       
        const { query = "", page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Create a case-insensitive regex for partial matching
        const searchRegex = query ? new RegExp(query, "i") : '';


        // Convert role input to numeric value
        let roleValue = null;
        if (query.toLowerCase().includes("owner")) roleValue = 1;
        if (query.toLowerCase().includes("admin")) roleValue = 2;
        
        // Find owners by partial matching in firstname, lastname, or phone
        const owners = await OwnerModel.find({
            $or: [
                { firstname: { $regex: searchRegex } },
                { lastname: { $regex: searchRegex } },
                { phone: { $regex: searchRegex } },
                ...(roleValue !== null ? [{ role: roleValue }] : [])
            ]
        })
            .skip(skip)
            .limit(parseInt(limit));

        // Format the response with full name and role
        const ownersWithRoles = owners.map(owner => ({
            id: owner._id, // Include the owner's ID
            name: `${owner.firstname} ${owner.lastname}`.trim(),
            phone: owner.phone,
            role: owner.role === 1 ? "Owner" : owner.role === 2 ? "Admin" : "Unknown",

        }));

        // Get total count for pagination
        const totalOwners = await OwnerModel.countDocuments({
            $or: [
                { firstname: { $regex: searchRegex } },
                { lastname: { $regex: searchRegex } },
                { phone: { $regex: searchRegex } },
                ...(roleValue !== null ? [{ role: roleValue }] : [])
            ]
        });

        res.json({
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalOwners / parseInt(limit)),
            totalOwners,
            owners: ownersWithRoles
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});



const registerAccount = asyncHandler(async (req, res) => {
    const { password, confirmPassword } = req.body;
    const id = req.params.id;

    if (!id) {
        console.log("Creating new user...");

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match." });
        }

        try {
            // Hash password before saving
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(password, salt);

            const usr = new OwnerModel(req.body);
            const result = await usr.save();
            return res.json(result);
        } catch (error) {
            if (error.code === 11000) {
                return res.status(401).json({ message: "Phone number already exists." });
            }
            return res.status(500).json({ message: "Internal server error.", error });
        }
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

        try {
            // Update user
            await OwnerModel.updateOne({ _id: id }, req.body);
            return res.json({ message: "User updated successfully." });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(401).json({ message: "Phone number already exists." });
            }
            return res.status(500).json({ message: "Internal server error.", error });
        }
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
    
    //const token = signJWTOwner("67c520d6fe18f42eb34e1dee",2);
    // console.log("Generated Token:", token);
    const token = signJWTOwner(user._id.toString(), user.phone, user.firstname, user.role)

    // Save refresh in database

    // const hashedToken = await bcrypt.hash(token.refreshToken, 10)

    // user.refreshToken = hashedToken
    // user.save()

    return res.json({Token:token})
})



const resetPassword = asyncHandler(async (req, res) => {

    const { id, newPassword, confirmPassword } = req.body;
    if (!id || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required." });
    }
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
    }

    let pwd = await bcrypt.hash(newPassword, 10);

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
    changePassword,
    getOwnerProfile,
    getAllOwners,
    searchOwners,
    deactivateOwner

}