const swagger = require("swagger-generator-express")

// Define your router here

const options = {
    title: "CADT Express API",
    version: "1.0.0",
    host: process.env.API_HOST,
    basePath: "/",
    schemes: ["http", "https"],
    securityDefinitions: {
        Bearer: {
            description: 'Example value:- Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5MmQwMGJhNTJjYjJjM',
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            bearerFormat: 'JWT'
        }
    },
    security: [{ Bearer: [] }],
    defaultSecurity: 'Bearer'
}

/**
 * serveSwagger must be called after defining your router.
 * @param app Express object
 * @param endPoint Swagger path on which swagger UI display
 * @param options Swagget Options.
 * @param path.routePath path to folder in which routes files defined.
 * @param path.requestModelPath Optional parameter which is path to folder in which requestModel defined, if not given request params will not display on swagger documentation.
 * @param path.responseModelPath Optional parameter which is path to folder in which responseModel defined, if not given response objects will not display on swagger documentation.
 */


function setupSwagger(app) {
    swagger.serveSwagger(app, "/docs", options, { routePath: './src/routes/', requestModelPath: './src/models/request', responseModelPath: './src/models/response' })
}

module.exports = setupSwagger