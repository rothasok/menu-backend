const Joi = require('@hapi/joi')

module.exports = {
    // createBook
    0: {
        body: {
            title: Joi.string().required(),
            genre: Joi.string().required(),
            description: Joi.string().required(),
            author: Joi.string().required(),
            page: Joi.number().required(),
        },
        model: "createBook", // Name of the model
        group: "Book", // Swagger tag for apis.
        description: "Create book and save details in database"
    }
}