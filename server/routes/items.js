const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

/*
    TODO?
    Gets all items?
    Not sure if needed as all of the items for a business can be found through the fk stuff and things
*/
router.get('/allitems', function(req, res){
    Item.find(function(err, items){
        if(err){
            console.log(err);
        } else {
            res.json(items);
        }
    })
});

/*
    TODO
    Probably make this get an item based off it's ObjectId
*/
router.get('/getitem', function(req, res){
    if(!req.body) return res.status(400).send({err: 'No request body'});
    let name = req.body.name;
    Item.findOne({name: name}, function(err, item){
        if(err){
            console.log(err);
        } else {
            res.json(item);
        }
    })
});

/*
    TODO
    Create an item
*/
router.get('/create', function(req, res){
    if(!req.body) return res.status(400).send({err: 'No request body'});
    let name = req.body.name;
    Item.findOne({name: name}, function(err, item){
        if(err){
            console.log(err);
        } else {
            res.json(item);
        }
    })
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