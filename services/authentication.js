const JWT = require("jsonwebtoken");
const User = require("../models/user");

const secret = "$uperMan@123";

function createTokenForUser(user){
    const payload = {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role
    };
    const token = JWT.sign(payload, secret);
    return token;
}

function verifyTokenForUser(token){
    const payload = JWT.verify(token, secret);
    return payload;
}

module.exports = {
    createTokenForUser,
    verifyTokenForUser
}