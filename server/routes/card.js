const express = require('express');
const router = express.Router();
const Card = require('../models/Card');
const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose');
const Tab = require('../models/Tab');
const verifyJWT = require('../middleware/auth');


/**
 * Get a card from card's ObjectId
 *
 * @route POST /card/get
 * @expects JWT in header of request, ObjectId in JSON in body of request
 * @success 200 GET, returns {formattedCard, code}
 * @error 400 Bad Request, No Request Body passed
 *        400 Bad Request, Type1: ObjectId is not 12 bytes
 *        400 Bad Request, Type2: ObjectId is not valid
 *        401 Unauthorized, Invalid Token
 *        404 Not Found, Card not found
 *        500 Internal Server Error
 */
router.post('/get', verifyJWT, function(req, res){
    //Check if req body exists
    if(!req.body) return res.status(400).send({err: 'No request body', code: 400});

    //find card by its objectid
    let objectId = req.body.id;

    //if objectId is 12 bytes in length, move on to next check
    if(mongoose.isValidObjectId(objectId)){
        //if objectId is an actually objectId (i.e., not a bunch of letters 12 bytes in length), attempt to find it
        if((String)(new ObjectId(objectId)) === objectId){
            Card.findById(objectId, function(err, card){
                if(err){
                    console.log(err);
                    return res.status(500).send({err: 'Internal Server Error', code: 500});
                } else {
                    //If card not found
                    if(card === null) return res.status(404).send({err: `Card does not exist`, code: 404});
                    let formattedCard = {
                        id: card._id,
                        name: card.name,
                        color: card.color,
                        dimensions: {
                            x: card.dimensions.x,
                            y: card.dimensions.y,
                            w: card.dimensions.width,
                            h: card.dimensions.height,
                        },
                        items: card.items
                    };
                    return res.status(200).send({formattedCard, code: 200});
                }
            });
        } else{
            return res.status(400).send({err: 'Type 2: Id is not a valid ObjectId', code: 400});
        }
    } else { //if objectId is not 
        return res.status(400).send({err: 'Type 1: Id is not a valid ObjectId', code: 400});
    }
});


/**
 * Create a card from JSON object
 *
 * @route POST /card/create
 * @expects JWT in header of request, card info in JSON in body of request
 * @success 201 Created, returns {formattedCard, code}
 * @error 400 Bad Request, No Request Body passed
 *        400 Bad Request, Type1: ObjectId is not 12 bytes
 *        400 Bad Request, Type2: ObjectId is not valid
 *        401 Unauthorized, Invalid Token
 *        404 Not Found, Tab not found to link Card 
 *        500 Internal Server Error
 */
router.post('/create', verifyJWT, async (req, res) => {
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

    //verify ObjectId is valid
    if(!(mongoose.isValidObjectId(tabId))){
        return res.status(400).send({err: 'Type 1: Id is not a valid ObjectId', code: 400});
    }
    if(!((String)(new ObjectId(tabId)) === tabId)){
        return res.status(400).send({err: 'Type 2: Id is not a valid ObjectId', code: 400});
    }

    //Find tab to link
    let tab = await Tab.findById(tabId).catch( err => {return res.status(500).send({err: 'Internal Server Error', code: 500});});
    if(tab === null) return res.status(404).send({err: 'Tab not found', code: 404});

    //Attempt to save tab 
    new_card.save(function(err, card) {
        if(err) {
            console.log(err);
            return res.status(500).send({err: 'Internal Server Error', code: 500});
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
                    return res.status(500).send({err: 'Internal Server Error', code: 500});
                }
            });
            return res.status(201).send({formattedCard, code: 201});
        }
    });
});


/**
 * TODO: not implemented & not working;
 * Modify a card's dimensions
 *
 * @route POST /card/dimensions
 * @expects 
 * @success 
 * @error 
 */
router.post('/dimensions', verifyJWT, async function(req, res){
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let find_card = await Card.findOne({name: req.body.name}).exec();
    if(!find_card) return res.status(403).send({err: 'Card does not exist', code: 403});
});


/**
 * TODO: not implemented & not working;
 * Modify a card's items
 *
 * @route POST /card/items
 * @expects 
 * @success 
 * @error 
 */
router.post('/items', verifyJWT, async function(req, res){
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let find_card = await Card.findOne({name: req.body.name}).exec();
    if(!find_card) return res.status(403).send({err: 'Card does not exist', code: 403});
});


/**
 * TODO: not implemented & not working;
 * Modify a card's color
 *
 * @route POST /card/color
 * @expects 
 * @success 
 * @error 
 */
router.post('/color', verifyJWT, async function(req, res){
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let find_card = await Card.findOne({name: req.body.name}).exec();
    if(!find_card) return res.status(403).send({err: 'Card does not exist', code: 403});
});

module.exports = router;