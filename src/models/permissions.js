const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the permissions schema
const permissionSchema = new mongoose.Schema({
  permissionName: { type: String, required: true, unique: true }, 
  slug:{type: String},
  description: { type: String }, 
});

// Create the Permissions Model
const permissionsModel = mongoose.model('Permissions', permissionSchema);

module.exports = permissionsModel;