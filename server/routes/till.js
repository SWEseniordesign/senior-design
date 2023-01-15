const express = require('express');
const router = express.Router();
const Till = require('../models/Till');
const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose');
const Business = require('../models/Business');

/*
    * DONE
    Gets a till by its objectid, does checks to ensure id is a correct objectid
*/
router.post('/get', function(req, res){
    //Check if req body exists
    if(!req.body) return res.status(400).send({err: 'No request body', code: 400});

    //find till by its objectid
    let objectId = req.body.id;

    //if objectId is 12 bytes in length, move on to next check
    if(mongoose.isValidObjectId(objectId)){
        //if objectId is an actually objectId, attempt to find it
        if((String)(new ObjectId(objectId)) === objectId){
            Till.findById(objectId, function(err, till){
                if(err){
                    console.log(err);
                    return res.status(500).send({err: 'Unable to get till', code: 500});
                } else {
                    //If till not found
                    if(till === null) return res.status(404).send({err: `Till does not exist`, code: 404});
                    let formattedTill = {
                        id: till._id,
                        name: till.name,
                        managerPassword: till.managerPassword,
                        employees: till.employees,
                        tabs: till.tabs,
                        props: till.props
                    };
                    return res.status(201).send({formattedTill, code: 201});
                }
            });
        }
    } else {
        return res.status(400).send({err: 'Id is not a valid ObjectId', code: 403});
    }
});

/*
    TODO see below; it works but for me it won't send back a res in certain scenarios
    Posts a till
*/
router.post('/create', async (req, res) => {
    //Check if req body exists
    if(!req.body) return res.status(400).send({err: 'No request body'});

    //Create temp new till
    let new_till = new Till({
        name: req.body.name,
        managerPassword: req.body.managerPassword,
        employees: req.body.employees,
        tabs: req.body.tabs,
        props: req.body.props
    });
    let businessId = req.body.businessId;


    //Checks if business already has a till with that name, if it does it won't add it
    //TODO check if this works; currently when a bus has a till in sys with same name it doesn't add it, but it doesnt send back a request?
    let business = await Business.findById(businessId).catch( err => {return res.status(500).send({err: 'Unable to find business in order to create till', code: 500});});
    if(business === null) return res.status(500).send({err: 'Unable to create till', code: 500});
    if(business.tills){
        
        let dupFound = false;
        for(let tillId of business.tills){
            let searchedTill = await Till.findById(tillId).clone(); //.clone() is probably not a good idea
            if(searchedTill.name === new_till.name){
                dupFound = true;
                break;
            }
        }
        if(dupFound){
            return res.status(400).send({err: 'Business already has a till with that name', code: 400});
        }
    }
    

    //Attempt to save till and update the businesses tills
    new_till.save(function(err, till) {
        if(err) {
            console.log(err);
            return res.status(500).send({err: 'Unable to create new till', code: 500});
        } else {
            let formattedTill = {
                id: till._id.toString(),
                name: till.name,
                managerPassword: till.managerPassword,
                employees: till.employees,
                tabs: till.tabs,
                props: till.props
            };
            //Adds the new till's ObjectId to the businesses tills and attempts to save it
            business.tills.push(new ObjectId(formattedTill.id));
            business.save(function(err, business){
                if(err) {
                    console.log(err);
                    return res.status(500).send({err: 'Unable to link till to business', code: 500});
                }
            });
            return res.status(201).send({formattedTill, code: 201});
        }
    });
});

/*
    TODO
    Add employees to till
*/
router.post('/employees', async function(req, res){
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let find_till = await Till.findOne({name: req.body.name}).exec();
    if(!find_till) return res.status(403).send({err: 'Till does not exist', code: 403});
});

/*
    TODO    
    Modify a till's tabs
*/
router.post('/tabs', async function(req, res){
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let find_till = await Till.findOne({name: req.body.name}).exec();
    if(!find_till) return res.status(403).send({err: 'Till does not exist', code: 403});
});

/*
    TODO
    Modify a till's props
*/
router.post('/props', async function(req, res){
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let find_till = await Till.findOne({name: req.body.name}).exec();
    if(!find_till) return res.status(403).send({err: 'Till does not exist', code: 403});
});

module.exports = router;