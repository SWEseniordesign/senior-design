const express = require('express');
const User = require('../models/User');
const router = express.Router();

/*
    TODO acutually setup token/auth stuff
    "logs a user in" but really get checks if they are in the db
*/
router.post('/login', async function(req, res) {
    if(!req.body) return res.status(400).send({err: 'No request body'});
    let find_user = await User.findOne({email: req.body.email, password: req.body.password}).exec();
    if(find_user) {
        res.status(200).send(find_user);
    }
    else {
        res.status(400).send({err: 'Invalid email or password'});
    }
})

/*
    Creates a new user
*/
router.post('/register', async function(req, res) {
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let new_user = new User({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        password: req.body.password,
        businessId: req.body.businessId
    });

    let find_user = await User.findOne({email: req.body.email}).exec();
    if(find_user) return res.status(403).send({err: 'User already exists', code: 403});

    new_user.save(function(err, savedUser) {
        if(err) {
            console.log(err);
            return res.status(500).send();
        }
        return res.status(201).send(true);
    });
});

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
    if(find_user.businessId){
        return res.status(201).send({business: 'true', code: 201});
    } else {
        return res.status(201).send({business: 'false', code: 201});
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