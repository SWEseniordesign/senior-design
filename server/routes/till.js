const express = require('express');
const router = express.Router();
const Till = require('../models/Till');

/*
TODO
Gets an till from a email
*/
router.get('/get', function(req, res){
    let email = req.body.email;
    Till.findOne({email: email}, function(err, till){
        if(err){
            console.log(err);
        } else {
            res.json(till);
        }
    })
});

/*
TODO
Posts a till
*/
router.post('/create', async (req, res) => {
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let new_till = new Till({
        email: req.body.email,
        isManager: req.body.isManager
    });

    let find_till = await Till.findOne({email: req.body.email}).exec();
    if(find_till) return res.status(403).send({err: 'till already exists', code: 403});

    new_till.save(function(err, savedtill) {
        if(err) {
            console.log(err);
            return res.status(500).send();
        }
        return res.status(201).send(true);
    });
});

module.exports = router;