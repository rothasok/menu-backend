const express = require('express');
const { signUp, login, handleGoogle, showGoogleOAuth, exchangeJWTToUser } = require('../controller/auth');
const authRouter = express.Router();

const { signUpSchema } = require('../common/validator');
const { handleValidation, verifyJWT } = require('../middlewares');

authRouter.post('/sign-up', signUpSchema, handleValidation, signUp)
authRouter.post('/login', login)
authRouter.get('/google-oauth', showGoogleOAuth)
authRouter.get('/google-callback', handleGoogle)
authRouter.get('/me', verifyJWT, exchangeJWTToUser)

module.exports = authRouter