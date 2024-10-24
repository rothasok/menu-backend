const { checkSchema } = require('express-validator');

const signUpSchema = checkSchema({
    email: {
        isEmail: true,
        errorMessage: 'Invalid email address',
    },
    lastname: {
        isAlpha: true,
        errorMessage: 'First name is text only',
    },
    firstname: {
        isAlpha: true,
        errorMessage: 'Last name is text only',
    },
    password: {
        isLength: {
            options: {
                min: 8
            }
        },
        errorMessage: "Password should be at least 8 characters"
    },
    confirmPassword: {
        custom: {
            options: async (value, { req }) => {
                if (value != req.body.password) {
                    throw new Error("Password mistatched!")
                }
            }
        }
    }
})

module.exports = { signUpSchema }