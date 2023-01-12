const express = require('express');
const router = express.Router();
const Card = require('../models/Card');

/*
    TODO format return object
    Gets a card
*/
router.post('/get', function(req, res){
    let name = req.body.name;
    Card.findOne({name: name}, function(err, till){
        if(err){
            console.log(err);
        } else {
            res.json(till);
        }
    })
});

/*
    Posts a card
*/
router.post('/create', async (req, res) => {
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let new_card = new Card({
        name: req.body.name,
        color: req.body.color,
        dimensions: req.body.dimensions,
        items: req.body.items
    });

    let find_card = await Card.findOne({name: req.body.name}).exec();
    if(find_card) return res.status(403).send({err: 'Card already exists', code: 403});

    new_card.save(function(err, savedTab) {
        if(err) {
            console.log(err);
            return res.status(500).send();
        }
        return res.status(201).send(true);
    });
});

/*
    TODO
    Modify a card's dimensions
*/
router.post('/dimensions', async function(req, res){
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let find_card = await Card.findOne({name: req.body.name}).exec();
    if(!find_card) return res.status(403).send({err: 'Card does not exist', code: 403});
});

/*
    TODO
    Modify a card's items
*/
router.post('/items', async function(req, res){
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let find_card = await Card.findOne({name: req.body.name}).exec();
    if(!find_card) return res.status(403).send({err: 'Card does not exist', code: 403});
});

/*
    TODO
    Modify a card's color
*/
router.post('/color', async function(req, res){
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let find_card = await Card.findOne({name: req.body.name}).exec();
    if(!find_card) return res.status(403).send({err: 'Card does not exist', code: 403});
});


module.exports = router;