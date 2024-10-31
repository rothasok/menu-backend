const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const UserModel = require('../models/user')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const { signJWT } = require('../utils')

const signUp = asyncHandler(async (req, res) => {
    const { firstname, lastname, email, password, confirmPassword } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const username = Date.now() + firstname

    const user = new UserModel({
        username: username,
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: hashedPassword
    })

    const result = await user.save()
    result.password = ''
    return res.json(result)
})

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email: email })

    if (!user) {
        return res.status(404).json("User not found!")
    }
    // SSO Logics
    if (user.type == "SSO") {
        return res.status(405).json("Only Password User Allowed")
    }

    const compareResult = await bcrypt.compare(password, user.password)
    if (!compareResult) {
        return res.status(401).json("Incorrect email or password")
    }
    // Sign JWT Token
    const token = signJWT(user._id, user.email, user.username)
    return res.json({ token })
})

const handleGoogle = asyncHandler(async (req, res) => {
    // Get one time code from OAuth Server
    const { code } = req.query
    // Exchange code with Goolge API server
    const { data } = await axios.post('https://oauth2.googleapis.com/token', {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URL,
        grant_type: 'authorization_code',
    })
    // User Aceess token (JWT) from Goolge API to request user information
    const { access_token } = data;
    const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo`,
        {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
    const userprofile = response.data;
    // console.log(userprofile.name.toString().replace(" ", "").toLowerCase())
    // Register in our database if user not in database yet and Sign JWT and return
    const user = await UserModel.findOne({ email: userprofile.email })
    if (!user) {
        const newUser = new UserModel({
            username: userprofile.name.toString().replace(" ", "").toLowerCase() + Date.now(),
            firstname: userprofile.name.toString().replace(" ", "").toLowerCase(),
            lastname: Date.now(),
            email: userprofile.email,
            type: "SSO"
        })
        newUser.save()
        const token = signJWT(newUser._id, newUser.email, newUser.username)
        return res.json({ token })
    }
    const token = signJWT(user._id, user.email, user.username)
    return res.json({ token })
    // If already registered sign JWT token and return
})

const showGoogleOAuth = (req, res) => {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URL}&response_type=code&scope=profile%20email&access_type=offline`;
    return res.redirect(googleAuthUrl)
}

const exchangeJWTToUser = asyncHandler(async (req, res) => {
    console.log(req.user)
    return res.json(req.user)
})

module.exports = { signUp, login, handleGoogle, showGoogleOAuth, exchangeJWTToUser }