const express = require('express')
const { 
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
    deactivateOwner } = require('../controller/owner.js')
const ownerRouter = express.Router()

// userRouter.put('/switchstatus/:id', toggleUserStatus);

// userRouter.put('/changepassword', changePassword);
// userRouter.put('/reset-password', resetPassword);
ownerRouter.post('/login', login)

ownerRouter.post('/:id?', registerAccount);
// userRouter.get('/', getUsers)
ownerRouter.get('/getownerbytoken', getUserbyToken)
ownerRouter.get('/profile/:id?', getOwnerProfile)
ownerRouter.post('/update/:id?', deactivateOwner)
ownerRouter.get('/', getAllOwners)
ownerRouter.get('/search', searchOwners)
// userRouter.get('/:id', getUserById)
// userRouter.delete('/:id', deleteUserById)
// userRouter.put('/:id', updateUserById)

module.exports = ownerRouter