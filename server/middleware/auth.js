const jwt = require('jsonwebtoken');

/*
 TODO:
 Add verifyJWT function to all routes that require authentication
 Add 'authentication' header to all requests that require authentication 
*/

function verifyJWT(req, res) {
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
    });
} module.exports = verifyJWT;