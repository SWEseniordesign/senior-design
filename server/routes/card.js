const express = require('express');
const router = express.Router();
const Card = require('../models/Card');
const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose');
const Tab = require('../models/Tab');


/*
    * DONE
    Gets a card
*/
router.post('/get', function(req, res){
    //Check if req body exists
    if(!req.body) return res.status(400).send({err: 'No request body', code: 400});

    //find card by its objectid
    let objectId = req.body.id;

    //if objectId is 12 bytes in length, move on to next check
    if(mongoose.isValidObjectId(objectId)){
        //if objectId is an actually objectId, attempt to find it
        if((String)(new ObjectId(objectId)) === objectId){
            Card.findById(objectId, function(err, card){
                if(err){
                    console.log(err);
                    return res.status(500).send({err: 'Unable to get card', code: 500});
                } else {
                    //If card not found
                    if(card === null) return res.status(404).send({err: `Card does not exist`, code: 404});
                    let formattedCard = {
                        id: card._id,
                        name: card.name,
                        managerPassword: card.managerPassword,
                        employees: card.employees,
                        tabs: card.tabs,
                        props: card.props
                    };
                    return res.status(201).send({formattedCard, code: 201});
                }
            });
        }
    } else {
        return res.status(400).send({err: 'Id is not a valid ObjectId', code: 403});
    }
});

/*
    Posts a card
*/
router.post('/create', async (req, res) => {
    //Check if req body exists
    if(!req.body) return res.status(400).send({err: 'No request body'});

    //Create temp new card
    let new_card = new Card({
        name: req.body.name,
        color: req.body.color,
        dimensions: req.body.dimensions,
        items: req.body.items,
    });
    let tabId = req.body.tabId;

    //Find tab to link
    let tab = await Tab.findById(tabId).catch( err => {return res.status(500).send({err: 'Error finding tab to link to card', code: 500});});
    if(tab === null) return res.status(500).send({err: 'Tab not found', code: 500});

    //Attempt to save tab 
    new_card.save(function(err, card) {
        if(err) {
            console.log(err);
            return res.status(500).send({err: 'Unable to create new card', code: 500});
        } else {
            let formattedCard = {
                id: card._id,
                name: card.name,
                managerPassword: card.managerPassword,
                employees: card.employees,
                tabs: card.tabs,
                props: card.props
            };
            //Attempts to update tab to include new card
            tab.cards.push(new ObjectId(formattedCard.id));
            tab.save(function(err, tab){
                if(err) {
                    console.log(err);
                    return res.status(500).send({err: 'Unable to link card to tab', code: 500});
                }
            });
            return res.status(201).send({formattedCard, code: 201});
        }
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