const express = require('express');
const User = require('../models/User');

const router = express.Router();

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
})

module.exports = router;