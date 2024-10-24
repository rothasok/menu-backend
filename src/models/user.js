const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    dateOfBirth: { type: Date },
    email: { type: String, required: true, unique: true },
    createdDate: { type: Date, required: true, default: new Date() },
    password: { type: String },
    type: { type: String, default: 'PW' }
})

const UserModel = mongoose.model('Users', userSchema)

module.exports = UserModel