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
        password: req.body.password
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
    TODO
    Update a users password
*/
router.post('/password', async (req, res) => {
    if(!req.body) return res.status(400).send({err: 'No request body'});
    let find_user = await User.findOne({email: req.body.email}).exec();
    if(!find_user) return res.status(403).send({err: 'User already exists', code: 403});
});

module.exports = router;