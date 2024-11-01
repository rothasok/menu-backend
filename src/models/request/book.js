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
    },
    1: {
        query: {
            limit: Joi.number().optional().default(10).description("Number of items to take"),
            page: Joi.number().optional().default(1),
            sort: Joi.string().optional(),
            query: Joi.string().optional(),
            populate: Joi.string().optional(),
            select: Joi.string().optional()
        },
        model: "getAllBooks",
        group: 'Book',
        description: 'Get all books'
    },
    2: {
        path: {
            id: Joi.string().required()
        },
        group: "Book", // Swagger tag for apis.
        description: "Get book by Id"
    },
    3: {
        path: {
            id: Joi.string().required()
        },
        group: "Book", // Swagger tag for apis.
        description: "Delete book by Id"
    },
    4: {
        path: {
            id: Joi.string().required()
        },
        body: {
            title: Joi.string().optional(),
            genre: Joi.string().optional(),
            description: Joi.string().optional(),
            author: Joi.string().optional(),
            page: Joi.number().optional(),
        },
        model: "updateBook", // Name of the model
        group: "Book", // Swagger tag for apis.
        description: "Update book and save details in database"
    }
}