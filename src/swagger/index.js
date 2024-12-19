const swagger = require("swagger-generator-express");

// Define your router and routes here

const options = {
    title: "CADT Express API",
    version: "1.0.0",
    host: process.env.API_HOST || "localhost:3000", // Default host fallback for development
    basePath: "/",
    schemes: ["http", "https"],
    securityDefinitions: {
        Bearer: {
            description: 'Example value: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5MmQwMGJhNTJjYjJjM',
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            bearerFormat: 'JWT'
        }
    },
    security: [{ Bearer: [] }],
    defaultSecurity: 'Bearer'
};


/**
 * Function to setup Swagger documentation.
 * @param {object} app - Express app instance
 */
function setupSwagger(app) {
    swagger.serveSwagger(app, "/docs", options, {
        routePath: './src/routes/', // Ensure this folder contains your route files
        requestModelPath: './src/models/request', // Path to request models (optional, update as needed)
        responseModelPath: './src/models/response' // Path to response models (optional, update as needed)
    });
}

module.exports = setupSwagger;
