const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const {verifyJWTOwner} = require('../middleware/auth');


/**
 * Log in a user from email and password
 *
 * @route POST /user/login
 * @expects JWT in header of request, email and password in JSON in body of request
 * @success 200 GET, returns {token, code}
 * @error 400 Bad Request, No Request Body passed
 *        404 Not Found, Till not found
 *        500 Internal Server Error
 */
router.post('/login', async function(req, res) {
    //Check if there is a body in the request
    if(Object.keys(req.body).length === 0) return res.status(400).send({err: 'No request body', code: 400});

    //find the user
    let find_user = await User.findOne({email: req.body.email}).exec().catch( err => {return res.status(500).send({err: 'Internal Server Error', code: 500})});
    if(!find_user) return res.status(404).send({err: 'Invalid email or password', code: 404});

    //Compare password hashes, and generate token if correct
    bcrypt.compare(req.body.password, find_user.password, function(err, result) {
        if(err) {
            console.log(err);
            return res.status(500).send({err: 'Internal server error', code: 500});
        }
        if(result) {
            const payload = {
                email: find_user.email,
                fname: find_user.fname,
                lname: find_user.lname,
                admin: true,
                owner: true
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN || '1h'});
            if(!token) return res.status(500).send({err: 'Internal server error', code: 500})
            return res.status(200).send({token: "Bearer " + token, code: 200}); 
        }
        else {
            return res.status(404).send({err: 'Invalid email or password', code: 404});
        }
    });
})


/**
 * Register a user from info
 *
 * @route POST /user/register
 * @expects JWT in header of request;fname, lname, email, password, & businessId in JSON in body of request
 * @success 201 Created, returns {created, code}
 * @error 400 Bad Request, No Request Body passed
 *        403 Forbidden, User with email already exists
 *        500 Internal Server Error
 */
router.post('/register', async function(req, res) {
    if(Object.keys(req.body).length === 0) return res.status(400).send({err: 'No request body', code: 400});

    //Create temp user
    let new_user = new User({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
        businessId: req.body.businessId
    });

    let find_user = await User.findOne({email: req.body.email}).exec().catch( err => {return res.status(500).send({err: 'Internal server error', code: 500})});
    if(find_user) return res.status(403).send({err: 'User already exists', code: 403});

    new_user.save(function(err, savedUser) {
        if(err) {
            console.log(err);
            return res.status(500).send({err: 'Internal server error', code: 500});
        }
        return res.status(201).send({created: true, code: 201});
    });
})


/**
 * Determines if a user has a business
 *
 * @route POST /user/business
 * @expects JWT in header of request
 * @success 200 GET, returns {created, code}
 * @error 400 Bad Request, No Request Body passed
 *        404 Not Found, User not found
 *        500 Internal Server Error
 */
router.post('/business', verifyJWTOwner, async (req, res) => {
    //find user by its objectId
    let find_user = await User.findOne({email: req.user.email}).catch( err => {return res.status(500).send({err: 'Internal Server Error', code: 500});});
    if(find_user === null) return res.status(404).send({err: 'User does not exists', code: 404});

    //If user has a business
    if(find_user.businessId !== null){
        return res.status(200).send({business: true, code: 200});
    } else {
        return res.status(200).send({business: false, code: 200});
    }
});


/**
 * TODO: implement
 * Update a users password
 *
 * @route POST /user/password
 * @expects 
 * @success 
 * @error 
 */
router.post('/password', verifyJWTOwner, async (req, res) => {
    if(!req.body) return res.status(400).send({err: 'No request body'});
    let find_user = await User.findOne({email: req.body.email}).exec();
    if(!find_user) return res.status(403).send({err: 'User already exists', code: 403});
});


/**
 * Get a users first and last name
 *
 * @route POST /user/name
 * @expects 
 * @success 
 * @error 
 */
router.post('/name', verifyJWTOwner, async (req, res) => {
    //find user by its JWT
    let find_user = await User.findOne({email: req.user.email}).exec().catch( err => {return res.status(500).send({err: 'Error finding user', code: 500})});
    if(find_user === null) return res.status(404).send({err: 'User does not exists', code: 404});
    
    let formattedUser = {
        fname: find_user.fname,
        lname: find_user.lname
    };

    return res.status(200).send({formattedUser, code: 200});
});

module.exports = router;