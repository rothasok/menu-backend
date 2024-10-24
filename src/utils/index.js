const jwt = require('jsonwebtoken')

function signJWT(id, email, username) {
    const token = jwt.sign(
        { id: id, email: email, username: username },
        process.env.JWT_SECRET, { expiresIn: '1h' }
    )
    return token
}

module.exports = { signJWT }