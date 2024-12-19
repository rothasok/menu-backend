const Joi = require('@hapi/joi');

module.exports = {
    // uploadFile
    0: {
        body: {
            type: Joi.string().required(),      // Type parameter
            num: Joi.string().required(),       // Num parameter
            title: Joi.string().required(),     // Title parameter
            role: Joi.string().required(),      // Role parameter
            file: Joi.object().required()       // File parameter
        },
        model: "uploadFile",                  // Name of the model
        group: "File Upload",                 // Swagger tag for APIs
        description: "Upload a file with additional parameters",
        consumes: ['multipart/form-data'],    // Specifies that the API consumes multipart/form-data
    }
};
