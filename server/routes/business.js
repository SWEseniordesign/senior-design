const express = require('express');
const router = express.Router();
const Business = require('../models/Business');

/*
TODO
Gets a business
*/
router.get('/get', function(req, res){
    let email = req.body.email;
    Business.findOne({email: email}, function(err, business){
        if(err){
            console.log(err);
        } else {
            res.json(business);
        }
    })
});

/*
TODO
Posts a business
*/
router.post('/create', async (req, res) => {
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let new_business = new Business({
        email: req.body.email,
        isManager: req.body.isManager
    });

    let find_business = await Business.findOne({email: req.body.email}).exec();
    if(find_business) return res.status(403).send({err: 'Business already exists', code: 403});

    new_business.save(function(err, savedBusiness) {
        if(err) {
            console.log(err);
            return res.status(500).send();
        }
        return res.status(201).send(true);
    });
});

module.exports = router;