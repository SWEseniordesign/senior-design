const express = require('express');
const router = express.Router();
const Till = require('../models/Till');
const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose');
const Business = require('../models/Business');
const verifyJWT = require('../middleware/auth');


/**
 * Get a till from ObjectId
 *
 * @route POST /till/get
 * @expects JWT in header of request, ObjectId in JSON in body of request
 * @success 200 GET, returns {formattedTill, code}
 * @error 400 Bad Request, No Request Body passed
 *        400 Bad Request, Type1: ObjectId is not 12 bytes
 *        400 Bad Request, Type2: ObjectId is not valid
 *        401 Unauthorized, Invalid Token
 *        404 Not Found, Till not found
 *        500 Internal Server Error
 */
router.post('/get', verifyJWT, function(req, res){
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
                    return res.status(500).send({err: 'Internal Server Error', code: 500});
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
                    return res.status(200).send({formattedTill, code: 200});
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
 * Create a till from ObjectId
 *
 * @route POST /till/create
 * @expects JWT in header of request, till info in JSON in body of request
 * @success 201 Create, returns {formattedTill, code}
 * @error 400 Bad Request, No Request Body passed
 *        400 Bad Request, Type1: ObjectId is not 12 bytes
 *        400 Bad Request, Type2: ObjectId is not valid
 *        401 Unauthorized, Invalid Token
 *        404 Not Found, Till not found
 *        500 Internal Server Error
 */
router.post('/create', verifyJWT, async (req, res) => {
    //Check if req body exists
    if(!req.body) return res.status(400).send({err: 'No request body', code: 400});

    //Create temp new till
    let new_till = new Till({
        name: req.body.name,
        managerPassword: req.body.managerPassword,
        employees: req.body.employees,
        tabs: req.body.tabs,
        props: req.body.props
    });
    let businessId = req.body.businessId;

    //verify ObjectId is valid
    if(!(mongoose.isValidObjectId(businessId))){
        return res.status(400).send({err: 'Type 1: Id is not a valid ObjectId', code: 400});
    }
    if(!((String)(new ObjectId(businessId)) === businessId)){
        return res.status(400).send({err: 'Type 2: Id is not a valid ObjectId', code: 400});
    }

    //Checks if business already has a till with that name, if it does it won't add it
    let business = await Business.findById(businessId).catch( err => {return res.status(500).send({err: 'Error finding business to link to till', code: 500});});
    if(business === null) return res.status(404).send({err: 'Business not found', code: 404});
    if(business.tills){
        let dupFound = false;
        for(let tillId of business.tills){
            let searchedTill = await Till.findById(tillId).clone(); //!.clone() is probably not a good idea
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
            return res.status(500).send({err: 'Internal Server Error', code: 500});
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
                    return res.status(500).send({err: 'Internal Server Error', code: 500});
                }
            });
            return res.status(201).send({formattedTill, code: 201});
        }
    });
});


/**
 * TODO: implement
 * Add employees to till
 *
 * @route POST /till/employees
 * @expects 
 * @success 
 * @error 
 */
router.post('/employees', verifyJWT, async function(req, res){
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let find_till = await Till.findOne({name: req.body.name}).exec();
    if(!find_till) return res.status(403).send({err: 'Till does not exist', code: 403});
});


/**
 * TODO: implement
 * Modify a till's tabs
 *
 * @route POST /till/tabs
 * @expects 
 * @success 
 * @error 
 */
router.post('/tabs', verifyJWT, async function(req, res){
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let find_till = await Till.findOne({name: req.body.name}).exec();
    if(!find_till) return res.status(403).send({err: 'Till does not exist', code: 403});
});


/**
 * TODO: implement
 * Modify a till's props
 *
 * @route POST /till/employees
 * @expects 
 * @success 
 * @error 
 */
router.post('/props', verifyJWT, async function(req, res){
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let find_till = await Till.findOne({name: req.body.name}).exec();
    if(!find_till) return res.status(403).send({err: 'Till does not exist', code: 403});
});

module.exports = router;