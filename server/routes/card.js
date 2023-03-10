const express = require('express');
const router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose');
const {verifyJWT, verifyJWTAdmin} = require('../middleware/auth');
const Tab = require('../models/Tab');
const Card = require('../models/Card');
const Item = require('../models/Item');


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
                        items: card.items,
                        static: card.static
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
router.post('/create', verifyJWTAdmin, async (req, res) => {
    //Check if req body exists
    if(!req.body) return res.status(400).send({err: 'No request body'});

    //Create temp new card
    let new_card = new Card({
        name: req.body.name,
        color: req.body.color,
        dimensions: req.body.dimensions,
        items: req.body.items,
        static: req.body.static
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
                color: card.color,
                dimensions: card.dimensions,
                items: card.items,
                static: card.static
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
 * Get all cards & items from tab ObjectId
 *
 * @route POST /card/getall
 * @expects JWT in header of request, ObjectId in JSON in body of request
 * @success 200 GET, returns {cards, code}
 * @error 400 Bad Request, No Request Body passed
 *        400 Bad Request, Type1: ObjectId is not 12 bytes
 *        400 Bad Request, Type2: ObjectId is not valid
 *        401 Unauthorized, Invalid Token
 *        404 Not Found, Tab not found
 *        404 Not Found, Card not found
 *        404 Not Found, Item not found
 *        500 Internal Server Error
 */
router.post('/getall', verifyJWT, async function(req, res){
    //Check if req body exists
    if(!req.body) return res.status(400).send({err: 'No request body', code: 400});

    //Store tabId
    let tabId = req.body.tabId.toString();

    //verify ObjectId is valid
    if(!(mongoose.isValidObjectId(tabId))) return res.status(400).send({err: 'Type 1: Id is not a valid ObjectId', code: 400});
    if(!((String)(new ObjectId(tabId)) === tabId)) return res.status(400).send({err: 'Type 2: Id is not a valid ObjectId', code: 400});

    //Find the tab
    let findTab = await Tab.findById(tabId).exec().catch( err => {return res.status(500).send({err: 'Internal Server Error', code: 500})});
    if(findTab === null) return res.status(404).send({err: 'Tab does not exist', code: 404});
    let tab = {
        id: findTab._id.toString(),
        name: findTab.name,
        color: findTab.color,
        cards: findTab.cards
    }

    //Check if tab has cards
    if(tab.cards.length === 0) return res.status(404).send({err: 'Tab does not have cards', code: 404});

    //Find the cards stored in tab
    let cards = [];
    for (let cardId of tab.cards) {
        cardId = cardId.toString();
        let card = await Card.findById(cardId).exec().catch( err => {return res.status(500).send({err: 'Internal Server Error', code: 500})});
        if(card === null) return res.status(404).send({err: 'Card does not exist', code: 404});   //! Not sure if we should exit if a tab isn't found

        //Get items for each card
        let items = [];
        for (let itemId of card.items){
            itemId = itemId.toString();
            let item = await Item.findById(itemId).exec().catch( err => {return res.status(500).send({err: 'Internal Server Error', code: 500})});
            if(item === null) return res.status(404).send({err: 'Item does not exist', code: 404});   //! Not sure if we should exit if a item isn't found
            let formattedItem = {
                id: item._id,
                name: item.name,
                price: item.price,
                image: item.image,
                props: item.props,
                stock: item.stock
            }
            items.push(formattedItem);
        }

        let formattedCard = {
            id: card._id,
            name: card.name,
            color: card.color,
            dimensions: card.dimensions,
            items: items,
            static: card.static
        }
        cards.push(formattedCard);
    }

    return res.status(200).send({cards, code: 200});
});


/**
 * Modify a card's position
 *
 * @route POST /card/modifyposition
 * @expects JWT in header of request; info in JSON in body of request
 * @success 200 POST, returns {updated, code}
 * @error 400 Bad Request, No Request Body passed
 *        400 Bad Request, Type1: ObjectId is not 12 bytes
 *        400 Bad Request, Type2: ObjectId is not valid
 *        401 Unauthorized, Invalid Token
 *        500 Internal Server Error
 */
router.post('/modifyposition', verifyJWTAdmin, async function(req, res){
    //Check if req body exists
    if(!req.body) return res.status(400).send({err: 'No request body'});

    //Create temp object
    let updatedDimensions = {
        x: req.body.x,
        y: req.body.y,
        width: req.body.width,
        height: req.body.height,
    }
    let staticUpdated = req.body.static;
    let cardId = req.body.cardId;

    //verify ObjectId is valid
    if(!(mongoose.isValidObjectId(cardId))) return res.status(400).send({err: 'Type 1: Id is not a valid ObjectId', code: 400});
    if(!((String)(new ObjectId(cardId)) === cardId)) return res.status(400).send({err: 'Type 2: Id is not a valid ObjectId', code: 400});

    //Find Tab and update it
    Card.findByIdAndUpdate(cardId, {dimensions: updatedDimensions, static: staticUpdated}, function(err, card){
        if(err){
            console.log(err);
            return res.status(500).send({err: 'Internal Server Error', code: 500});
        }
        return res.status(200).send({updated: true, code: 200});
    });
});


/**
 * Delete a card & the items in it from card's ObjectId
 *
 * @route POST /card/delete
 * @expects JWT in header of request, ObjectId in JSON in body of request
 * @success 200 GET, returns {formattedCard, code}
 * @error 400 Bad Request, No Request Body passed
 *        400 Bad Request, Type1: ObjectId is not 12 bytes
 *        400 Bad Request, Type2: ObjectId is not valid
 *        401 Unauthorized, Invalid Token
 *        404 Not Found, Card not found
 *        404 Not Found, Item not found
 *        500 Internal Server Error
 */
router.post('/delete', verifyJWTAdmin, function(req, res){
    //Check if req body exists
    if(!req.body) return res.status(400).send({err: 'No request body', code: 400});

    //find card by its objectid
    let cardId = req.body.cardId.toString();
    let tabId = req.body.tabId.toString();

    //verify ObjectId is valid
    if(!(mongoose.isValidObjectId(cardId)) && !(mongoose.isValidObjectId(tabId))) return res.status(400).send({err: 'Type 1: Id is not a valid ObjectId', code: 400});
    if(!((String)(new ObjectId(cardId)) === cardId) && !((String)(new ObjectId(tabId)) === tabId)) return res.status(400).send({err: 'Type 2: Id is not a valid ObjectId', code: 400});

    Card.findById(cardId, async function(err, card){
        if(err){
            console.log(err);
            return res.status(500).send({err: 'Internal Server Error', code: 500});
        } else {
            //If card not found
            if(card === null) return res.status(404).send({err: `Card not found`, code: 404});

            //Deletes items
            for(let itemId of card.items){
                itemId = itemId.toString();
                Item.findByIdAndDelete(itemId, function(err, item){
                    if(err){
                        console.log(err);
                        return res.status(500).send({err: 'Internal Server Error', code: 500});
                    }
                });
            }

            //Delete Card
            Card.deleteOne({_id: card._id}, function(err, cardDeleted){
                if(err){
                    console.log(err);
                    return res.status(500).send({err: 'Internal Server Error', code: 500});
                }
            });

            //Remove Card from Tab
            Tab.findById(tabId, function(err, tab){
                if(err){
                    console.log(err);
                    return res.status(500).send({err: 'Internal Server Error', code: 500});
                }

                //Check if Card is in Tab
                let indexofCard = tab.cards.indexOf(cardId);
                if(indexofCard === -1) return res.status(404).send({err: 'Card Not Found in Tab', code: 404});

                //Remove Card and save
                tab.cards.splice(indexofCard, 1);
                tab.save(function(err, tillSaved){
                    if(err) {
                        console.log(err);
                        return res.status(500).send({err: 'Internal Server Error', code: 500});
                    }
                });
            });
            return res.status(200).send({deleted: true, code: 200});
        }
    });
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
router.post('/items', verifyJWTAdmin, async function(req, res){
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
router.post('/color', verifyJWTAdmin, async function(req, res){
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let find_card = await Card.findOne({name: req.body.name}).exec();
    if(!find_card) return res.status(403).send({err: 'Card does not exist', code: 403});
});

module.exports = router;