const Joi = require('@hapi/joi');

module.exports = {
    0: {
        body: {
            
        },
        model: "SwitchStatus", // Name of the model
        group: 'User',         // Group for the API
        description: 'Execute to switch status of users to be active or inactive'
    },
    1: {
        body: {
            id: Joi.string().required().default('673ed145b6c19badd34f7f32'),
            assigningrole: Joi.string().required().default('673dfa34b279e0c524813282'),
        },
        model: "setRole", // Name of the model
        group: 'User',         // Group for the API
        description: 'assign role by role_id to user by user_id'
    },
    2: {
        body: {
            id: Joi.string().required().default('6751a0090f92579e3ece118f'),
            oldPassword: Joi.string().required().default('12345678'),
            newPassword: Joi.string().required().default('123456789'),
        },
        model: "changePassword", // Name of the model
        group: 'User',         // Group for the API
        description: 'change password'
    },
    3: {
        body: {
            id: Joi.string().required().default('6751a0090f92579e3ece118f'),
            newPassword: Joi.string().required().default('12345678'),
            confirmPassword: Joi.string().required().default('12345678'),
        },
        model: "resetPassword", // Name of the model
        group: 'User',         // Group for the API
        description: 'Reset Password'
    },
    4: {
      
        group: 'User',         // Group for the API
        description: 'get all users'
    },
    5: {
      
        group: 'User',         // Group for the API
        description: 'get the user info by token'
    },
    6: {

        group: 'User',         // Group for the API
        description: 'get user info by user id'
    },
    7: {

        group: 'User',         // Group for the API
        description: 'delete user by user id'
    },
    8: {

        group: 'User',         // Group for the API
        description: 'update user by user id'
    },
};
