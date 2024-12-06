const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Role schema
const roleSchema = new mongoose.Schema({
  roleName: { type: String, required: true, unique: true }, // Admin, User, Guest, etc.
  description: { type: String, required: true }, // Optional description of the role
  permissions: [{ type: mongoose.Types.ObjectId, ref: 'Permissions', }],
});

// Create the Role model
const RoleModel = mongoose.model('Role', roleSchema);

module.exports = RoleModel;

permission:["dpt1","dpt2"]