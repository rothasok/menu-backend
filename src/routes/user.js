const express = require('express')
const { createUser, getUsers, getUserById, deleteUserById, updateUserById,getUserbyToken,resetPassword,setuserRole,toggleUserStatus,changePassword } = require('../controller/user.js')
const userRouter = express.Router()

userRouter.put('/switchstatus/:id', toggleUserStatus);
userRouter.put('/set-role', setuserRole);
userRouter.put('/changepassword', changePassword);
userRouter.put('/reset-password', resetPassword);
userRouter.post('/:id?', createUser)
userRouter.get('/', getUsers)
userRouter.get('/getUserbyToken', getUserbyToken)
userRouter.get('/:id', getUserById)
userRouter.delete('/:id', deleteUserById)
userRouter.put('/:id', updateUserById)

module.exports = userRouter