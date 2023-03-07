const express = require('express');
const router = express.Router();
const Tab = require('../models/Tab');
const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose');
const Till = require('../models/Till');
const verifyJWT = require('../middleware/auth');


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

    //find tab by its objectid
    let objectId = req.body.id;
 
    //if objectId is 12 bytes in length, move on to next check
    if(mongoose.isValidObjectId(objectId)){
        //if objectId is an actually objectId, attempt to find it
        if((String)(new ObjectId(objectId)) === objectId){
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
        } else {
            return res.status(400).send({err: 'Type 2: Id is not a valid ObjectId', code: 400});
        }
    } else {
        return res.status(400).send({err: 'Type 1: Id is not a valid ObjectId', code: 400});
    }
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
router.post('/create', verifyJWT, async (req, res) => {
    //check if req body exists
    if(!req.body) return res.status(400).send({err: 'No request body', code: 400});

    //Create temp new tab
    let new_tab = new Tab({
        name: req.body.name,
        color: req.body.color,
        cards: req.body.cards
    });
    let tillId = req.body.tillId;

    //verify ObjectId is valid
    if(!(mongoose.isValidObjectId(tillId))){
        return res.status(400).send({err: 'Type 1: Id is not a valid ObjectId', code: 400});
    }
    if(!((String)(new ObjectId(tillId)) === tillId)){
        return res.status(400).send({err: 'Type 2: Id is not a valid ObjectId', code: 400});
    }

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
 * TODO: implement
 * Edit a tab's name and color
 *
 * @route POST /tab/edit
 * @expects JWT in header of request; ObjectId in JSON in body of request
 * @success 
 * @error 
 */
router.post('/edit', verifyJWT, async function(req, res){
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let find_tab = await Tab.findOne({name: req.body.name}).exec();
    if(!find_tab) return res.status(403).send({err: 'Tab does not exist', code: 403});
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
router.post('/cards', verifyJWT, async function(req, res){
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let find_tab = await Tab.findOne({name: req.body.name}).exec();
    if(!find_tab) return res.status(403).send({err: 'Tab does not exist', code: 403});
});

module.exports = router;