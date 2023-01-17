const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', async function(req, res) {
    if(!req.body) return res.status(400).send({err: 'No request body', code: 400});
    let find_user = await User.findOne({email: req.body.email}).exec();
    if(!find_user) return res.status(400).send({err: 'Invalid email or password', code: 400});
    bcrypt.compare(req.body.password, find_user.password, function(err, result) {
        if(err) {
            console.log(err);
            return res.status(500).send({err: 'Internal server error', code: 500});
        }
        if(result) {
            const payload = {
                email: find_user.email,
                fname: find_user.fname,
                lname: find_user.lname
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN || '1h'});
            if(!token) return res.status(500).send({err: 'Internal server error', code: 500})
            return res.status(200).send({user: find_user, token: "Bearer " + token}); //TODO: remove user from response
        }
        else {
            return res.status(400).send({err: 'Invalid email or password', code: 400});
        }
    });
})

router.post('/register', async function(req, res) {
    if(!req.body) return res.status(400).send({err: 'No request body', code: 400});

    let new_user = new User({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
        businessId: req.body.businessId
    });

    let find_user = await User.findOne({email: req.body.email}).exec();
    if(find_user) return res.status(403).send({err: 'User already exists', code: 403});

    new_user.save(function(err, savedUser) {
        if(err) {
            console.log(err);
            return res.status(500).send({err: 'Internal server error', code: 500});
        }
        return res.status(201).send(true);
    });
})

/*
    Determines if user has a business
*/
router.post('/business', async (req, res) => {
    //Check if req body 
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let userId = req.body.id;

    //find user by its objectId
    let find_user = await User.findById(userId).catch( err => {return res.status(500).send({err: 'Error finding user', code: 500});})
    if(find_user === null) return res.status(403).send({err: 'User does not exists', code: 403});

    //If user has a business
    if(find_user.businessId !== null){
        return res.status(201).send({business: true, code: 201});
    } else {
        return res.status(201).send({business: false, code: 201});
    }
});

/*
    TODO
    Update a users password
*/
router.post('/password', async (req, res) => {
    if(!req.body) return res.status(400).send({err: 'No request body'});
    let find_user = await User.findOne({email: req.body.email}).exec();
    if(!find_user) return res.status(403).send({err: 'User already exists', code: 403});
});

module.exports = router;