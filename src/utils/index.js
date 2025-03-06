const jwt = require('jsonwebtoken')
const zlib = require("zlib");
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

// function signJWTOwner(id,phone,firstname,role) {
//     const Token = jwt.sign(
//         { 

//             // id: id, 
//             // phone: phone, 
//             r,// username: username,
//             i},
//         process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRE }
//     )
//    console.log(Token)
//     return { Token }
// }


const signJWTOwner = (id, phone, firstname, role) => {
    try {
        const payload = {
            id: id.toString(),  // Convert to string if needed
            phone: phone,       // Explicit key-value pairs
            firstname: firstname,
            role: role
        };

        const accessToken = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_ACCESS_EXPIRE } // Default to 1h if not set
        );

        console.log("Signed token:", payload);
        return accessToken;
    } catch (error) {
        console.error("Error signing JWT:", error.message);
        return null; // Return null if signing fails
    }
};



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

module.exports = { signJWT,signJWTOwner,claimTokenData};