const jwt = require('jsonwebtoken');
const User = require('../models/User');

/*
    Verifies that a jwt passed in through header is valid
    If valid, add user to req and continue to backend call thing
    else return error
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