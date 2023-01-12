const express = require('express');
const router = express.Router();
const Tab = require('../models/Tab');

/*
    TODO format return object
    Gets a till
*/
router.post('/get', function(req, res){
    let name = req.body.name;
    Tab.findOne({name: name}, function(err, till){
        if(err){
            console.log(err);
        } else {
            res.json(till);
        }
    })
});

/*
    Posts a till
*/
router.post('/create', async (req, res) => {
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let new_tab = new Tab({
        name: req.body.name,
        color: req.body.color,
        cards: req.body.cards
    });

    let find_tab = await Tab.findOne({name: req.body.name}).exec();
    if(find_tab) return res.status(403).send({err: 'tab already exists', code: 403});

    new_tab.save(function(err, savedTab) {
        if(err) {
            console.log(err);
            return res.status(500).send();
        }
        return res.status(201).send(true);
    });
});

/*
    TODO
    Modify a tabs's color
*/
router.post('/color', async function(req, res){
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let find_tab = await Tab.findOne({name: req.body.name}).exec();
    if(!find_tab) return res.status(403).send({err: 'Tab does not exist', code: 403});
});

/*
    TODO
    Modify a tabs's cards
*/
router.post('/cards', async function(req, res){
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let find_tab = await Tab.findOne({name: req.body.name}).exec();
    if(!find_tab) return res.status(403).send({err: 'Tab does not exist', code: 403});
});

module.exports = router;