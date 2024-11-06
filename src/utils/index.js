const jwt = require('jsonwebtoken')

// function signJWT(id, email, username) {
//     const token = jwt.sign(
//         { id: id, email: email, username: username },
//         process.env.JWT_SECRET, { expiresIn: '1h' }
//     )
//     return token
// }

function signJWT(id, email, username) {
    const accessToken = jwt.sign(
        { id: id, email: email, username: username },
        process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRE }
    )
    const refreshToken = jwt.sign(
        { id: id, email: email, username: username },
        process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE }
    )
    return { accessToken, refreshToken }
}


module.exports = { signJWT }