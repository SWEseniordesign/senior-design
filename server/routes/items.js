const express = require('express');
const router = express.Router();
//const dotenv = require('dotenv');
const Item = require('../models/Item');

// TODO
router.get('/allitems', function(req, res){
    Item.find(function(err, items){
        if(err){
            console.log(err);
        } else {
            res.json(items);
        }
    })
})

// TODO
router.get('/getitem/', function(req, res){
    let name = req.body.name;
    Item.findOne({name: name}, function(err, item){
        if(err){
            console.log(err);
        } else {
            res.json(item);
        }
    })
})

router.get('/temp', (req, res) => {
    console.log('Hello World');
    res.send({msg: 'Hello World', val: 1});
})

module.exports = router;