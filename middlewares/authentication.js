const JWT = require("jsonwebtoken");
const { verifyTokenForUser } = require("../services/authentication");

function checkForAuthenticationCookie(cookie){
    return function(req, res, next){
        const cookieValue = req.cookies[cookie];

        if(!cookieValue) { return next() };

        try{
            const payload = verifyTokenForUser(cookieValue);
            req.user = payload;
        }
        catch(error){ }

        return next();
    }
}

module.exports = {
    checkForAuthenticationCookie
}