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
function claimTokenData(req){
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1]; // Extract token part
        return jwt.decode(token);
      } else {
        console.log("No token found in Authorization header.");
      }
    return "Token is incorrect";
}

module.exports = { signJWT ,claimTokenData}