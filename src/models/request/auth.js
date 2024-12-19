const Joi = require('@hapi/joi')

module.exports = {
    
    0: {
        body: {
            email: Joi.string().required().default('admin@example.com'),
            password: Joi.string().required().default('12345678'),
        },
        model: "login", // Name of the model
        group: "Authentication", // Swagger tag for apis.
        description: "Login up user"
    },

    1: {
        model: "exchangeJWTToUser", // Name of the model
        group: "Authentication", // Swagger tag for APIs.
        description: "refreshToken"
    },

}