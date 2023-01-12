const express = require('express');
const router = express.Router();
const Business = require('../models/Business');

/*
    TODO Format return object
    Gets a business
*/
router.post('/get', function(req, res){
    let name = req.body.name;
    Business.findOne({name: name}, function(err, business){
        if(err){
            console.log(err);
        } else {
            res.json(business);
        }
    })
});

/*
    Posts a business
*/
router.post('/create', async (req, res) => {
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let new_business = new Business({
        name: req.body.name,
        ownerId: req.body.ownerId,
        type: req.body.type,
        admins: req.body.admins,
        tills: req.body.tills
    });

    let find_business = await Business.findOne({email: req.body.name}).exec();
    if(find_business) return res.status(403).send({err: 'Business already exists', code: 403});

    new_business.save(function(err, savedBusiness) {
        if(err) {
            console.log(err);
            return res.status(500).send();
        }
        return res.status(201).send(true);
    });
});

/*
    TODO
    Modify a businesses' admins
*/
router.post('/admins', async function(req, res){
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let find_business = await Business.findOne({email: req.body.name}).exec();
    if(find_business) return res.status(403).send({err: 'Business already exists', code: 403});
});

/*
   TODO 
    Modify a businesses' tills
*/
router.post('/tills', async function(req, res){
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let find_business = await Business.findOne({email: req.body.name}).exec();
    if(find_business) return res.status(403).send({err: 'Business already exists', code: 403});
});

module.exports = router;