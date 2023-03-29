const express = require('express');
const router = express.Router();
const Tab = require('../models/Tab');
const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose');
const Till = require('../models/Till');
const Card = require('../models/Card');
const Item = require('../models/Card');
const {verifyJWT, verifyJWTAdmin} = require('../middleware/auth');


/**
 * Get a tab from ObjectId
 *
 * @route POST /tab/get
 * @expects JWT in header of request, ObjectId in JSON in body of request
 * @success 200 GET, returns {formattedTab, code}
 * @error 400 Bad Request, No Request Body passed
 *        400 Bad Request, Type1: ObjectId is not 12 bytes
 *        400 Bad Request, Type2: ObjectId is not valid
 *        401 Unauthorized, Invalid Token
 *        404 Not Found, Tab not found
 *        500 Internal Server Error
 */
router.post('/get', verifyJWT, function(req, res){
    //Check if req body exists
    if(!req.body) return res.status(400).send({err: 'No request body', code: 400});

    //Verify input
    if(typeof req.body.id === 'undefined' || !req.body.id) return res.status(400).send({err: 'Invalid id input', code: 400});

    //find tab by its objectid
    let objectId = req.body.id;

    //verify ObjectId is valid
    if(!(mongoose.isValidObjectId(objectId))) return res.status(400).send({err: 'Type 1: Id is not a valid ObjectId', code: 400});
    if(!((String)(new ObjectId(objectId)) === objectId)) return res.status(400).send({err: 'Type 2: Id is not a valid ObjectId', code: 400});
 
    //Find Tab
    Tab.findById(objectId, function(err, tab){
        if(err){
            console.log(err);
            return res.status(500).send({err: 'Internal Server Error', code: 500});
        } else {
            //If tab not found
            if(tab === null) return res.status(404).send({err: `Tab does not exist`, code: 404});
            let formattedTab = {
                id: tab._id,
                name: tab.name,
                color: tab.color,
                cards: tab.cards
            };
            return res.status(200).send({formattedTab, code: 200});
        }
    });
});


/**
 * Create a tab from passed in tab info
 *
 * @route POST /tab/create
 * @expects JWT in header of request; name, color, cards, & tillId in JSON in body of request
 * @success 201 Create, returns {formattedTab, code}
 * @error 400 Bad Request, No Request Body passed
 *        400 Bad Request, Type1: ObjectId is not 12 bytes
 *        400 Bad Request, Type2: ObjectId is not valid
 *        401 Unauthorized, Invalid Token
 *        404 Not Found, Tab not found
 *        500 Internal Server Error
 */
router.post('/create', verifyJWTAdmin, async (req, res) => {
    //check if req body exists
    if(!req.body) return res.status(400).send({err: 'No request body', code: 400});

    //Verify input
    if(typeof req.body.name === 'undefined' || !req.body.name) return res.status(400).send({err: 'Invald name input', code: 400});
    if(typeof req.body.tillId === 'undefined' || !req.body.tillId) return res.status(400).send({err: 'Invald tillId input', code: 400});

    //Create temp new tab
    let new_tab = new Tab({
        name: req.body.name,
        color: req.body.color,
        cards: req.body.cards
    });
    let tillId = req.body.tillId;

    //verify ObjectId is valid
    if(!(mongoose.isValidObjectId(tillId))) return res.status(400).send({err: 'Type 1: Id is not a valid ObjectId', code: 400});
    if(!((String)(new ObjectId(tillId)) === tillId)) return res.status(400).send({err: 'Type 2: Id is not a valid ObjectId', code: 400});

    //Find till to link
    let till = await Till.findById(tillId).catch( err => {return res.status(500).send({err: 'Error finding till to link to tab', code: 500});});
    if(till === null) return res.status(404).send({err: 'Till not found', code: 404});

    //Attempt to save tab 
    new_tab.save(function(err, tab) {
        if(err) {
            console.log(err);
            return res.status(500).send({err: 'Internal Server Error', code: 500});
        } else {
            let formattedTab = {
                id: tab._id,
                name: tab.name,
                color: tab.color,
                cards: tab.cards
            };
            //Attempts to update till to include the new tab
            till.tabs.push(new ObjectId(formattedTab.id));
            till.save(function(err, till){
                if(err) {
                    console.log(err);
                    return res.status(500).send({err: 'Internal Server Error', code: 500});
                }
            });
            return res.status(201).send({formattedTab, code: 201});
        }
    });
});


/**
 * Get all tabs from till ObjectId
 *
 * @route POST /tab/getall
 * @expects JWT in header of request, ObjectId in JSON in body of request
 * @success 200 GET, returns {tabs, code}
 * @error 400 Bad Request, No Request Body passed
 *        400 Bad Request, Type1: ObjectId is not 12 bytes
 *        400 Bad Request, Type2: ObjectId is not valid
 *        401 Unauthorized, Invalid Token
 *        404 Not Found, Tab not found
 *        404 Not Found, Till not found
 *        404 Not Found, Till has no Tabs
 *        500 Internal Server Error
 */
router.post('/getall', verifyJWT, async function(req, res){
    //Check if req body exists
    if(!req.body) return res.status(400).send({err: 'No request body', code: 400});

    //Verify input
    if(typeof req.body.tillId === 'undefined' || !req.body.tillId) return res.status(400).send({err: 'Invald tillId input', code: 400});

    //Store tillId
    let tillId = req.body.tillId.toString();

    //verify ObjectId is valid
    if(!(mongoose.isValidObjectId(tillId))) return res.status(400).send({err: 'Type 1: Id is not a valid ObjectId', code: 400});
    if(!((String)(new ObjectId(tillId)) === tillId)) return res.status(400).send({err: 'Type 2: Id is not a valid ObjectId', code: 400});

    //Find the till
    let findTill = await Till.findById(tillId).exec().catch( err => {return res.status(500).send({err: 'Internal Server Error', code: 500})});
    if(findTill === null) return res.status(404).send({err: 'Till does not exist', code: 404});
    let till = {
        id: findTill._id.toString(),
        name: findTill.name,
        managerPassword: findTill.managerPassword,
        tabs: findTill.tabs,
        props: findTill.props
    }

    //Check if till has tabs
    if(till.tabs.length === 0) return res.status(404).send({err: 'Till does not have tabs', code: 404});

    //Find the tabs stored in till
    let tabs = [];
    for (let tabId of till.tabs) {
        tabId = tabId.toString();
        let tab = await Tab.findById(tabId).exec().catch( err => {return res.status(500).send({err: 'Internal Server Error', code: 500})});
        if(tab === null) return res.status(404).send({err: 'Tab does not exist', code: 404});   //! Not sure if we should exit if a tab isn't found
        let formattedTab = {
            id: tab._id,
            name: tab.name,
            color: tab.color,
            cards: tab.cards,
        }
        tabs.push(formattedTab);
    }

    return res.status(200).send({tabs, code: 200});
});


/**
 * Edit a tab's name and color
 *
 * @route POST /tab/edit
 * @expects JWT in header of request; info in JSON in body of request
 * @success 200 POST, returns {updated, code}
 * @error 400 Bad Request, No Request Body passed
 *        400 Bad Request, Type1: ObjectId is not 12 bytes
 *        400 Bad Request, Type2: ObjectId is not valid
 *        401 Unauthorized, Invalid Token
 *        500 Internal Server Error
 */
router.post('/update', verifyJWTAdmin, async function(req, res){
    //Check if req body exists
    if(!req.body) return res.status(400).send({err: 'No request body'});

    //Verify input
    if(typeof req.body.name === 'undefined' || !req.body.name) return res.status(400).send({err: 'Invald name input', code: 400});
    if(typeof req.body.tabId === 'undefined' || !req.body.tabId) return res.status(400).send({err: 'Invald tabId input', code: 400});

    //Create temp object
    let updatedTab = {
        name: req.body.name,
        color: req.body.color
    }
    let tabId = req.body.tabId;

    //verify ObjectId is valid
    if(!(mongoose.isValidObjectId(tabId))) return res.status(400).send({err: 'Type 1: Id is not a valid ObjectId', code: 400});
    if(!((String)(new ObjectId(tabId)) === tabId)) return res.status(400).send({err: 'Type 2: Id is not a valid ObjectId', code: 400});

    //Find Tab and update it
    Tab.findByIdAndUpdate(tabId, {name: updatedTab.name, color: req.body.color}, function(err, till){
        if(err){
            console.log(err);
            return res.status(500).send({err: 'Internal Server Error', code: 500});
        }
        return res.status(200).send({updated: true, code: 200});
    });
});


/**
 * Delete a Tab and its cards & items from tab ObjectId
 *
 * @route POST /tab/delete
 * @expects JWT in header of request, ObjectId in JSON in body of request
 * @success 200 GET, returns {tabs, code}
 * @error 400 Bad Request, No Request Body passed
 *        400 Bad Request, Type1: ObjectId is not 12 bytes
 *        400 Bad Request, Type2: ObjectId is not valid
 *        401 Unauthorized, Invalid Token
 *        404 Not Found, Tab not found
 *        404 Not Found, Till not found
 *        404 Not Found, Till has no Tabs
 *        500 Internal Server Error
 */
router.post('/delete', verifyJWT, async function(req, res){
    //Check if req body exists
    if(!req.body) return res.status(400).send({err: 'No request body', code: 400});

    //Verify input
    if(typeof req.body.tillId === 'undefined' || !req.body.tillId) return res.status(400).send({err: 'Invald tillId input', code: 400});
    if(typeof req.body.tabId === 'undefined' || !req.body.tabId) return res.status(400).send({err: 'Invald tabId input', code: 400});

    //Store Ids
    let tabId = req.body.tabId.toString();
    let tillId = req.body.tillId.toString();

    //verify ObjectId is valid
    if(!(mongoose.isValidObjectId(tabId)) && !(mongoose.isValidObjectId(tillId))) return res.status(400).send({err: 'Type 1: Id is not a valid ObjectId', code: 400});
    if(!((String)(new ObjectId(tabId)) === tabId) && !((String)(new ObjectId(tillId)) === tillId)) return res.status(400).send({err: 'Type 2: Id is not a valid ObjectId', code: 400});

    
    Tab.findById(tabId, async function(err, tab){
        if(err){
            console.log(err);
            return res.status(500).send({err: 'Internal Server Error', code: 500});
        } else {
            //If tab not found
            if(tab === null) return res.status(404).send({err: `Tab not found`, code: 404});

            //Delete Cards & Items in them
            for(let cardId of tab.cards){
                cardId = cardId.toString();
                Card.findById(cardId, function(err, card){
                    if(err){
                        console.log(err);
                        return res.status(500).send({err: 'Internal Server Error', code: 500});
                    }
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
                    let cardId = card._id.toString();
                    //Delete Card
                    Card.deleteOne({_id: card._id}, function(err, cardDeleted){
                        if(err){
                            console.log(err);
                            return res.status(500).send({err: 'Internal Server Error', code: 500});
                        }
                    });

                    //Remove Card from Tab (not necessary but if error occurs this will be nice)
                    let indexofCard = tab.cards.indexOf(cardId);
                    if(indexofCard === -1) return res.status(404).send({err: 'Card Not Found in Tab', code: 404});
                    tab.cards.splice(indexofCard, 1);
                    tab.save(function(err, tillSaved){
                        if(err) {
                            console.log(err);
                            return res.status(500).send({err: 'Internal Server Error', code: 500});
                        }
                    });
                });
            }

            //Delete Tab
            Tab.deleteOne({_id: tab._id}, function(err, tabDelete){
                if(err) {
                    console.log(err);
                    return res.status(500).send({err: 'Internal Server Error', code: 500});
                }
            });

            //Remove Tab from Till
            Till.findById(tillId, function(err, till){
                if(err) {
                    console.log(err);
                    return res.status(500).send({err: 'Internal Server Error', code: 500});
                }

                let indexofTab = till.tabs.indexOf(tabId);
                if(indexofTab === -1) return res.status(404).send({err: 'Tab Not Found in Till', code: 404});
                till.tabs.splice(indexofTab, 1);
                till.save(function(err, tillSaved){
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
 * TODO: implement
 * Modify a tab's cards
 *
 * @route POST /tab/cards
 * @expects JWT in header of request; ObjectId in JSON in body of request
 * @success 
 * @error 
 */
router.post('/cards', verifyJWTAdmin, async function(req, res){
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let find_tab = await Tab.findOne({name: req.body.name}).exec();
    if(!find_tab) return res.status(403).send({err: 'Tab does not exist', code: 403});
});

module.exports = router;