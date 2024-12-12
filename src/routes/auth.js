const express = require('express');
const { signUp, login, handleGoogle, showGoogleOAuth, exchangeJWTToUser, exchangeRefreshToken } = require('../controller/auth');
const authRouter = express.Router();

const { signUpSchema } = require('../common/validator');
const { handleValidation, verifyJWT, verifyRefresh } = require('../middlewares');

authRouter.post('/login', login)
authRouter.post('/sign-up/:id?', signUpSchema, handleValidation, signUp)

// authRouter.get('/google-oauth', showGoogleOAuth)
// authRouter.get('/google-callback', handleGoogle)
authRouter.get('/me', verifyJWT, exchangeJWTToUser)
authRouter.get('/refresh', verifyRefresh, exchangeRefreshToken)

module.exports = authRouter