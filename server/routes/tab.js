const express = require('express');
const router = express.Router();
const Tab = require('../models/Tab');
const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose');
const Till = require('../models/Till');


/*
    * DONE
    Gets a tab by the tabs objectid (stored in the till)
*/
router.post('/get', function(req, res){
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
        }
    } else {
        return res.status(400).send({err: 'Id is not a valid ObjectId', code: 403});
    }
});

/*
    TODO: format return, link newly created tab to till
    Posts a tab
*/
router.post('/create', async (req, res) => {
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let new_tab = new Tab({
        name: req.body.name,
        color: req.body.color,
        cards: req.body.cards
    });
    let tillId = req.body.tillId;

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