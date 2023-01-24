const express = require('express');
const router = express.Router();
const Tab = require('../models/Tab');
const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose');
const Till = require('../models/Till');
const verifyJWT = require('../middleware/auth');


/*
    * DONE
    Gets a tab by the tabs objectid (stored in the till)
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
                    return res.status(500).send({err: 'Unable to get tab', code: 500});
                } else {
                    //If tab not found
                    if(tab === null) return res.status(404).send({err: `Tab does not exist`, code: 404});
                    let formattedTab = {
                        id: tab._id,
                        name: tab.name,
                        color: tab.color,
                        cards: tab.cards
                    };
                    return res.status(201).send({formattedTab, code: 201});
                }
            });
        } else {
            return res.status(400).send({err: 'Type 2: Id is not a valid ObjectId', code: 403});
        }
    } else {
        return res.status(400).send({err: 'Type 1: Id is not a valid ObjectId', code: 403});
    }
});

/*
    * DONE
    Posts a tab and adds it to a Till
*/
router.post('/create', verifyJWT, async (req, res) => {
    //check if req body exists
    if(!req.body) return res.status(400).send({err: 'No request body'});

    //Create temp new tab
    let new_tab = new Tab({
        name: req.body.name,
        color: req.body.color,
        cards: req.body.cards
    });
    let tillId = req.body.tillId;

    //verify ObjectId is valid
    if(!(mongoose.isValidObjectId(tillId))){
        return res.status(400).send({err: 'Type 1: Id is not a valid ObjectId', code: 403});
    }
    if(!((String)(new ObjectId(tillId)) === tillId)){
        return res.status(400).send({err: 'Type 2: Id is not a valid ObjectId', code: 403});
    }

    //Find till to link
    let till = await Till.findById(tillId).catch( err => {return res.status(500).send({err: 'Error finding till to link to tab', code: 500});});
    if(till === null) return res.status(500).send({err: 'Till not found', code: 500});

    //Attempt to save tab 
    new_tab.save(function(err, tab) {
        if(err) {
            console.log(err);
            return res.status(500).send({err: 'Unable to create new tab', code: 500});
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
                    return res.status(500).send({err: 'Unable to link tab to till', code: 500});
                }
            });
            return res.status(201).send({formattedTab, code: 201});
        }
    });
});

/*
    TODO
    Modify a tabs's color
*/
router.post('/color', verifyJWT, async function(req, res){
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let find_tab = await Tab.findOne({name: req.body.name}).exec();
    if(!find_tab) return res.status(403).send({err: 'Tab does not exist', code: 403});
});

/*
    TODO
    Modify a tabs's cards
*/
router.post('/cards', verifyJWT, async function(req, res){
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let find_tab = await Tab.findOne({name: req.body.name}).exec();
    if(!find_tab) return res.status(403).send({err: 'Tab does not exist', code: 403});
});

module.exports = router;