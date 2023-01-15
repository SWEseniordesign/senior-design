const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose');
const Card = require('../models/Card');

/*
    TODO
    Fetch item based on ObjectId
*/
router.post('/get', function(req, res){
    //Check if req body exists
    if(!req.body) return res.status(400).send({err: 'No request body', code: 400});

    //find item by its objectid
    let objectId = req.body.id;
 
    //if objectId is 12 bytes in length, move on to next check
    if(mongoose.isValidObjectId(objectId)){
        //if objectId is an actually objectId, attempt to find it
        if((String)(new ObjectId(objectId)) === objectId){
            Item.findById(objectId, function(err, item){
                if(err){
                    console.log(err);
                    return res.status(500).send({err: 'Unable to get item', code: 500});
                } else {
                    //If tab not found
                    if(item === null) return res.status(404).send({err: `Item does not exist`, code: 404});
                    let formattedItem = {
                        id: item._id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        props: item.props,
                        stock: item.stock
                    };
                    return res.status(201).send({formattedItem, code: 201});
                }
            });
        }
    } else {
        return res.status(400).send({err: 'Id is not a valid ObjectId', code: 403});
    }
});

/*
    TODO
    Create an item
*/
router.post('/create', async function(req, res){
    //check if req body exists
    if(!req.body) return res.status(400).send({err: 'No request body'});

    //Create temp new item
    let new_item = new Item({
        name: req.body.name,
        price: req.body.price,
        image: req.body.image,
        props: req.body.props,
        stock: req.body.stock
    });
    let cardId = req.body.cardId;

    //console.log();
    //Find till to link
    let card = await Card.findById(cardId).catch( err => {return res.status(500).send({err: 'Error finding card to link to item', code: 500});});
    if(card === null) return res.status(500).send({err: 'Card not found', code: 500});

    //Attempt to save item
    new_item.save(function(err, item) {
        if(err) {
            console.log(err);
            return res.status(500).send({err: 'Unable to create new item', code: 500});
        } else {
            let formattedItem = {
                id: item._id,
                name: item.name,
                price: item.price,
                image: item.image,
                props: item.props,
                stock: item.stock
            };
            //Attempts to update till to include the new tab
            card.items.push(new ObjectId(formattedItem.id));
            card.save(function(err, card){
                if(err) {
                    console.log(err);
                    return res.status(500).send({err: 'Unable to link item to card', code: 500});
                }
            });
            return res.status(201).send({formattedItem, code: 201});
        }
    });
});

/*
    TODO
    Change an items name 
*/
router.get('/name', async (req, res) => {
    if(!req.body) return res.status(400).send({err: 'No request body'});
    let find_item = await Item.findOne({name: req.body.name}).exec();
    if(!find_item) return res.status(403).send({err: 'Item does not exist', code: 403});
});

/*
    TODO
    Change an items image 
*/
router.get('/image', async (req, res) => {
    if(!req.body) return res.status(400).send({err: 'No request body'});
    let find_item = await Item.findOne({name: req.body.name}).exec();
    if(!find_item) return res.status(403).send({err: 'Item does not exist', code: 403});
});

/*
    TODO
    Change an items props 
*/
router.get('/props', async (req, res) => {
    if(!req.body) return res.status(400).send({err: 'No request body'});
    let find_item = await Item.findOne({name: req.body.name}).exec();
    if(!find_item) return res.status(403).send({err: 'Item does not exist', code: 403});
});

/*
    TODO
    Change an items stock 
*/
router.get('/stock', async (req, res) => {
    if(!req.body) return res.status(400).send({err: 'No request body'});
    let find_item = await Item.findOne({name: req.body.name}).exec();
    if(!find_item) return res.status(403).send({err: 'Item does not exist', code: 403});
});

module.exports = router;