const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose');
const Card = require('../models/Card');
const {verifyJWT, verifyJWTAdmin} = require('../middleware/auth');

/**
 * Get a item from ObjectId
 *
 * @route POST /items/get
 * @expects JWT in header of request, ObjectId in JSON in body of request
 * @success 200 GET, returns {formattedItem, code}
 * @error 400 Bad Request, No Request Body passed
 *        400 Bad Request, Type1: ObjectId is not 12 bytes
 *        400 Bad Request, Type2: ObjectId is not valid
 *        401 Unauthorized, Invalid Token
 *        404 Not Found, Item not found
 *        500 Internal Server Error
 */
router.post('/get', verifyJWT, function(req, res){
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
                    return res.status(500).send({err: 'Internal Server Error', code: 500});
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
                    return res.status(200).send({formattedItem, code: 200});
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
 * Create a item from passed in item info
 *
 * @route POST /items/create
 * @expects JWT in header of request, name, price, image, props, & stock in JSON in body of request
 * @success 201 Created, returns {formattedItem, code}
 * @error 400 Bad Request, No Request Body passed
 *        400 Bad Request, Type1: ObjectId is not 12 bytes
 *        400 Bad Request, Type2: ObjectId is not valid
 *        401 Unauthorized, Invalid Token
 *        404 Not Found, Item not found
 *        500 Internal Server Error
 */
router.post('/create', verifyJWTAdmin, async function(req, res){
    //check if req body exists
    if(!req.body) return res.status(400).send({err: 'No request body', code: 400});

    //Create temp new item
    let new_item = new Item({
        name: req.body.name,
        price: req.body.price,
        image: req.body.image,
        props: req.body.props,
        stock: req.body.stock
    });
    let cardId = req.body.cardId;
    console.log(cardId);

    //verify ObjectId is valid
    if(!(mongoose.isValidObjectId(cardId))){
        return res.status(400).send({err: 'Type 1: Id is not a valid ObjectId', code: 400});
    }
    if(!((String)(new ObjectId(cardId)) === cardId)){
        return res.status(400).send({err: 'Type 2: Id is not a valid ObjectId', code: 400});
    }

    //Find card to link
    let card = await Card.findById(cardId).catch( err => {return res.status(500).send({err: 'Internal Server Error', code: 500});});
    if(card === null) return res.status(404).send({err: 'Card not found', code: 404});

    //Attempt to save item
    new_item.save(function(err, item) {
        if(err) {
            console.log(err);
            return res.status(500).send({err: 'Internal Server Error', code: 500});
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
                    return res.status(500).send({err: 'Internal Server Error', code: 500});
                }
            });
            return res.status(201).send({formattedItem, code: 201});
        }
    });
});


/**
 * Delete a item from ObjectId
 *
 * @route POST /items/delete
 * @expects JWT in header of request, ObjectId in JSON in body of request
 * @success 200 Ok, returns {formattedItem, code}
 * @error 400 Bad Request, No Request Body passed
 *        400 Bad Request, Type1: ObjectId is not 12 bytes
 *        400 Bad Request, Type2: ObjectId is not valid
 *        401 Unauthorized, Invalid Token
 *        404 Not Found, Item not found
 *        500 Internal Server Error
 */
router.post('/delete', verifyJWTAdmin, async function(req, res){
    //Check if req body exists
    if(!req.body) return res.status(400).send({err: 'No request body', code: 400});

    //find item by its objectid
    let itemId = req.body.itemId;
    let cardId = req.body.cardId;

    //Verify objectId is valid
    if(!mongoose.isValidObjectId(itemId) && !mongoose.isValidObjectId(cardId)) return res.status(400).send({err: 'Type 1: Id is not a valid ObjectId', code: 400});
    if(!((String)(new ObjectId(itemId)) === itemId) && !((String)(new ObjectId(cardId)) === cardId)) return res.status(400).send({err: 'Type 2: Id is not a valid ObjectId', code: 400});

    //Find and delete item
    let foundItem = await Item.findById(itemId).catch( err => {return res.status(500).send({err: 'Internal Server Error', code: 500});});
    if(foundItem == null) return res.status(404).send({err: 'Item not found', code: 404});
    Item.deleteOne({_id: foundItem._id}, function(err, item){
        if(err){
            console.log(err);
            return res.status(500).send({err: 'Internal Server Error', code: 500});
        }
        // return res.status(200).send({deleted: true, code: 200});
    });

    //Find Card
    Card.findById(cardId, function(err, card){
        if(err){
            console.log(err);
            return res.status(500).send({err: 'Internal Server Error', code: 500});
        }
        //If card not found
        if(card === null) return res.status(404).send({err: `Card not found`, code: 404});

        //Find item in Card
        let indexofItem = card.items.indexOf(itemId);
        if(indexofItem === -1) return res.status(404).send({err: 'Card Not Found in Tab', code: 404});

        //Remove Item and save
        card.items.splice(indexofItem, 1);
        card.save(function(err, tillSaved){
            if(err) {
                console.log(err);
                return res.status(500).send({err: 'Internal Server Error', code: 500});
            }
        });
        return res.status(200).send({deleted: true, code: 200});
    });
});


/**
 * Update an Item's name, price, & stock
 *
 * @route POST /items/update
 * @expects 
 * @success 
 * @error 
 */
router.post('/update', verifyJWTAdmin, async (req, res) => {
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let updatedItem = {
        name: req.body.name,
        price: req.body.price,
        image: req.body.image,
        props: req.body.props,
        stock: req.body.stock
    };
    let itemId = req.body.itemId;

    if(!mongoose.isValidObjectId(itemId)) return res.status(400).send({err: 'Type 1: Id is not a valid ObjectId', code: 400});
    if(!((String)(new ObjectId(itemId)) === itemId)) return res.status(400).send({err: 'Type 2: Id is not a valid ObjectId', code: 400});

    Item.updateOne({
        _id: new ObjectId(itemId),
        $or: [
            { name:  { $ne: updatedItem.name  }},
            { price: { $ne: updatedItem.price }},
            { image: { $ne: updatedItem.image }},
            { props: { $ne: updatedItem.props }},
            { stock: { $ne: updatedItem.stock }}
        ]
    },
    {
        $set: {
            name:  updatedItem.name,
            price: updatedItem.price,
            image: updatedItem.image,
            props: updatedItem.props,
            stock: updatedItem.stock
        }
    }).catch( err => {return res.status(500).send({err: 'Internal Server Error', code: 500});});

    return res.status(200).send({updated: true, code: 200});
});


/**
 * TODO: implement
 * Modify an item's image
 *
 * @route POST /items/image
 * @expects 
 * @success 
 * @error 
 */
router.get('/image', verifyJWTAdmin, async (req, res) => {
    if(!req.body) return res.status(400).send({err: 'No request body'});
    let find_item = await Item.findOne({name: req.body.name}).exec();
    if(!find_item) return res.status(403).send({err: 'Item does not exist', code: 403});
});


/**
 * TODO: implement
 * Modify an item's props
 *
 * @route POST /items/props
 * @expects 
 * @success 
 * @error 
 */
router.get('/props', verifyJWTAdmin, async (req, res) => {
    if(!req.body) return res.status(400).send({err: 'No request body'});
    let find_item = await Item.findOne({name: req.body.name}).exec();
    if(!find_item) return res.status(403).send({err: 'Item does not exist', code: 403});
});


/**
 * TODO: implement
 * Modify an item's stock
 *
 * @route POST /items/stock
 * @expects 
 * @success 
 * @error 
 */
router.get('/stock', verifyJWTAdmin, async (req, res) => {
    if(!req.body) return res.status(400).send({err: 'No request body'});
    let find_item = await Item.findOne({name: req.body.name}).exec();
    if(!find_item) return res.status(403).send({err: 'Item does not exist', code: 403});
});

module.exports = router;