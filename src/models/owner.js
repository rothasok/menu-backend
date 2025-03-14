// const { type } = require('@hapi/joi/lib/extend');
// const mongoose = require('mongoose');
// const mongoosePaginate = require('mongoose-paginate-v2');
// // const { roles } = require('./permission');


// // const userSchema = new mongoose.Schema({
// //   username: { type: String, required: true, unique: true },
// //   firstname: { type: String, required: true },
// //   lastname: { type: String, required: true },
// //   dateOfBirth: { type: Date,default: new Date() },
// //   email: { type: String, required: true, unique: true },
// //   createdDate: { type: Date, required: true, default: new Date() },
// //   password: { type: String },
// //   refreshToken: { type: String },
// //   type: { type: String, default: 'PW' },
// //   permission: {
// //     type: String,
// //     enum: [roles.ADMIN.role, roles.USER.role, roles.GUESS.role],
// //     default: roles.USER.role,
// //   },
// // });

// // userSchema.plugin(mongoosePaginate);

// // const UserModel = mongoose.model('Users', userSchema);
// const ownerSchema = new mongoose.Schema({
//     firstname:{type:String},
//     lastname:{type:String},
//     phone:{type:String,required:true, unique:true},
//     password: { type: String },
//     active: { type: Number, default:'1'},
//     role: { type: Number, required:true, default:'1'}, // role: 1 owner, role :2 admin
//     // refreshToken: { type: String },
//   });
//   // Create the User model
//   const OwnerModel = mongoose.model('Owner', ownerSchema)
//   ownerSchema.plugin(mongoosePaginate);
// module.exports = OwnerModel;

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ownerSchema = new mongoose.Schema({
    firstname: { type: String },
    lastname: { type: String },
    phone: { type: String, required: true, unique: true },
    password: { type: String },
    active: { type: Number, default: 1 },  // Default should be a number, not a string
    role: { type: Number, required: true, default: 1 }, // Default should be a number
});

// Apply the pagination plugin BEFORE model creation
ownerSchema.plugin(mongoosePaginate);

// Create the User model
const OwnerModel = mongoose.model('Owner', ownerSchema);

module.exports = OwnerModel;
