const jwt = require('jsonwebtoken');
const User = require('../models/User');


/**
 * Verifies if JWT in header is valid
 *
 * @expects JWT in header of request
 * @success returns user in request (req.user)
 * @error 401 Unauthorized, Invalid Token
 */
function verifyJWT(req, res, next) {
    const bearerToken = req.headers['authorization'];
    if(!bearerToken) return res.status(401).send({err: 'No token provided', code: 401});
    let tokArr = bearerToken.split(' ');
    let token = tokArr[1];
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
        if(err) {
            console.log(err);
            return res.status(401).send({err: 'Invalid token', code: 401});
        }
        req.user = decoded;
        next();
    });
} module.exports = verifyJWT;