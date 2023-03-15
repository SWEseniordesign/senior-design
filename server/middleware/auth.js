const jwt = require('jsonwebtoken');


/**
 * Verifies if JWT in header is valid, allow access to everyone
 * Note: This is for requests (get requests) anyone can make (owners, managers, & employee)
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
}


/**
 * Verifies if JWT in header is valid, allow access to owners & managers
 * Note: This is for requests only owners & managers can perform
 *
 * @expects JWT in header of request
 * @success returns user in request (req.user)
 * @error 401 Unauthorized, Invalid Token
 */
function verifyJWTAdmin(req, res, next) {
    const bearerToken = req.headers['authorization'];
    if(!bearerToken) return res.status(401).send({err: 'No token provided', code: 401});
    let tokArr = bearerToken.split(' ');
    let token = tokArr[1];
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
        if(err) {
            console.log(err);
            return res.status(401).send({err: 'Invalid token', code: 401});
        }
        if(!decoded.admin) return res.status(401).send({err: 'Unauthorized to perform request', code: 401});
        req.user = decoded;
        next();
    });
}


/**
 * Verifies if JWT in header is valid and decodes, allows access to owners
 * Note: This is for requests only owners can perform
 *
 * @expects JWT in header of request
 * @success returns user in request (req.user)
 * @error 401 Unauthorized, Invalid Token
 */
function verifyJWTOwner(req, res, next) {
    const bearerToken = req.headers['authorization'];
    if(!bearerToken) return res.status(401).send({err: 'No token provided', code: 401});
    let tokArr = bearerToken.split(' ');
    let token = tokArr[1];
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
        if(err) {
            console.log(err);
            return res.status(401).send({err: 'Invalid token', code: 401});
        }
        if(!decoded.owner) return res.status(401).send({err: 'Unauthorized to perform request', code: 401});
        req.user = decoded;
        next();
    });
}

module.exports = {verifyJWT, verifyJWTAdmin, verifyJWTOwner};