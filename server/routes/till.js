const express = require('express');
const router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose');
const User = require('../models/User');
const Business = require('../models/Business');
const Till = require('../models/Till');
const Employee = require('../models/Employee');
const {verifyJWT, verifyJWTAdmin, verifyJWTOwner} = require('../middleware/auth');
const jwt = require('jsonwebtoken');


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
                        id: till._id.toString(),
                        loginId: till.loginId,
                        name: till.name,
                        managerPassword: till.managerPassword,
                        employees: till.employees,
                        tabs: till.tabs,
                        props: till.props,
                        transactions: till.transactions
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
router.post('/create', verifyJWTOwner, async (req, res) => {
    //Check if req body exists
    if(!req.body) return res.status(400).send({err: 'No request body', code: 400});

    //Create temp new till
    let new_till = new Till({
        name: req.body.name,
        managerPassword: req.body.managerPassword,
        employees: req.body.employees,
        tabs: req.body.tabs,
        props: req.body.props,
        transactions: []
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

    let formattedTill;
    //Attempt to save till and update the businesses tills
    new_till.save(function(err, till) {
        if(err) {
            console.log(err);
            return res.status(500).send({err: 'Internal Server Error', code: 500});
        } else {
            formattedTill = {
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

            Till.findByIdAndUpdate(formattedTill.id, {loginId: formattedTill.id.slice(-6)}, function(err, till){
                if(err){
                    console.log(err);
                    Till.findByIdAndDelete(formattedTill.id, function(err, till){
                        if(err) return res.status(500).send({err: 'Internal Server Error', code: 500});
                    });
                    return res.status(500).send({err: 'Internal Server Error', code: 500});
                }
                else{
                    formattedTill.loginId = till.loginId;
                    return res.status(201).send({formattedTill, code: 201});
                }
            });
        }
    });
});


/**
 * Get all tills from business via jwt
 *
 * @route POST /till/getall
 * @expects JWT in header of request, ObjectId in JSON in body of request
 * @success 200 GET, returns {business, tills, code}
 * @error 400 Bad Request, No Request Body passed
 *        400 Bad Request, Type1: ObjectId is not 12 bytes
 *        400 Bad Request, Type2: ObjectId is not valid
 *        401 Unauthorized, Invalid Token
 *        404 Not Found, User does not exist
 *        404 Not Found, Business does not exist
 *        404 Not Found,Till does not exist
 *        500 Internal Server Error
 */
router.post('/getall', verifyJWT, async function(req, res){
    //Find user from JWT
    let userResult = await User.findOne({email: req.user.email}).exec().catch( err => {return res.status(500).send({err: 'Internal Server Error', code: 500})});
    if(userResult === null) return res.status(404).send({err: 'User does not exist', code: 404});
    if(userResult.businessId === null) return res.status(403).send({err: 'User does not have a business', code: 403});
    let user = {
        id: userResult._id.toString(),
        fname: userResult.fname,
        lname: userResult.lname,
        email: userResult.email,
        businessId: userResult.businessId.toString()
    }

    //Find the business
    let businessResult = await Business.findOne({ownerId: user.id}).exec().catch( err => {return res.status(500).send({err: 'Internal Server Error', code: 500})});
    if(businessResult === null) return res.status(404).send({err: 'Business does not exist', code: 404});
    let business = {
        id: businessResult._id.toString(),
        name: businessResult.name,
        type: businessResult.type,
        ownerId: businessResult.ownerId.toString(),
        admins: businessResult.admins,
        tills: businessResult.tills
    }       

    if(business.tills.length === 0) return res.status(404).send({err: 'Business does not have tills', code: 404});

    //Grab tills
    let tills = [];
    for (let tillId of business.tills) {
        tillId = tillId.toString();

        //Find till
        let till = await Till.findById(tillId).exec().catch( err => {return res.status(500).send({err: 'Internal Server Error', code: 500})});
        if(till === null) return res.status(404).send({err: 'Till does not exist', code: 404});
        let formattedTill = {
            id: till._id,
            loginId: till.loginId,
            name: till.name,
            managerPassword: till.managerPassword,
            employees: till.employees,
            tabs: till.tabs,
            props: till.props
        }
        tills.push(formattedTill);
    }

    return res.status(200).send({business, tills, code: 200});
});


/**
 * Add an Employee to a Till
 *
 * @route POST /till/addemployee
 * @expects 
 * @success 
 * @error 
 */
router.post('/addemployee', verifyJWTAdmin, async function(req, res){
    //check if req body exists 
    if(!req.body) return res.status(400).send({err: 'No request body'});

    //Store tillId
    let tillId = req.body.tillId;

    //verify ObjectId is valid
    if(!(mongoose.isValidObjectId(tillId))) return res.status(400).send({err: 'Type 1: Id is not a valid ObjectId', code: 400});
    if(!((String)(new ObjectId(tillId)) === tillId)) return res.status(400).send({err: 'Type 2: Id is not a valid ObjectId', code: 400});

    //Find the Employee via the email
    let foundEmployee = await Employee.findOne({email: req.body.email}).exec().catch( err => {return res.status(500).send({err: 'Internal Server Error', code: 500})});

    //If the Employee already exists in db, link them to the Till
    if(foundEmployee){
        let formattedEmployee = {
            id: foundEmployee._id.toString(),
            email: foundEmployee.email,
            isManager: foundEmployee.isManager
        }
        //Find Till
        Till.findById(tillId, function(err, till){
            if(err) {
                console.log(err);
                return res.status(500).send({err: 'Internal Server Error', code: 500});
            }

            //If Employee is not in Till, add them
            if(!till.employees.includes(foundEmployee.email)){ 
                till.employees.push(foundEmployee.email);
                till.save(function(err, tillSaved){
                    if(err) {
                        console.log(err);
                        return res.status(500).send({err: 'Internal Server Error', code: 500});
                    }
                });
                return res.status(201).send({formattedEmployee, code: 201});
            }
            //else return
            return res.status(400).send({err: 'Employee already exists in Till', code: 400});
        });
    }
    //If the Employee does not exist in db, create them & add them to the Till
    else{
        //Create Employee
        let newEmployee = new Employee({
            email: req.body.email,
            isManager: req.body.isManager
        });

        //Save Employee and add them to Till
        newEmployee.save(function(err, employee) {
            if(err) {
                console.log(err);
                return res.status(500).send({err: 'Internal Server Error', code: 500});
            }
            else {
                //formats the return object to send to frontend
                let formattedEmployee = {
                    id: employee._id.toString(),
                    email: employee.email,
                    isManager: employee.isManager
                }
                
                //Finds Till and adds employee if applicable
                Till.findById(tillId, function(err, till){
                    if(err) {
                        console.log(err);
                        return res.status(500).send({err: 'Internal Server Error', code: 500});
                    }
                    if(till.employees.includes(employee.email)) return res.status(400).send({err: 'Employee already exists in Till', code: 400});
                    till.employees.push(employee.email);
                    till.save(function(err, tillSaved){
                        if(err) {
                            console.log(err);
                            return res.status(500).send({err: 'Internal Server Error', code: 500});
                        }
                    });
                });
                return res.status(201).send({formattedEmployee, code: 201});
            }
        });
    }
});


/**
 * Verify a employee's credentials
 *
 * @route POST /till/auth
 * @expects 
 * @success 
 * @error 
 */
router.post('/auth', async function(req, res){
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let till = await Till.findOne({loginId: req.body.tillid}).exec().catch( err => {return res.status(500).send({err: 'Internal Server Error', code: 500})});
    if(!till) return res.status(403).send({err: 'Till does not exist', code: 403});
    if(till.employees.indexOf(req.body.email) === -1) return res.status(404).send({err: 'Employee Not Found', code: 404});
    if(till.managerPassword !== parseInt(req.body.password)) return res.status(401).send({err: 'Incorrect Password', code: 401});
    let employee = await Employee.findOne({email: req.body.email}).exec().catch( err => {return res.status(500).send({err: 'Internal Server Error', code: 500})});

    //Create JWT via email and tillid
    const payload = {
        email: req.body.email,
        tillId: req.body.tillid,
        admin: employee.isManager
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN || '8h'});
    if(!token) return res.status(500).send({err: 'Internal server error', code: 500});
    return res.status(200).send({token: "Bearer " + token, objId: till._id.toString(), code: 200}); 
});


/**
 * Remove Employee from Till
 *
 * @route POST /till/removeemployee
 * @expects 
 * @success 
 * @error 
 */
router.post('/removeemployee', verifyJWTAdmin, async function(req, res){
    if(!req.body) return res.status(400).send({err: 'No request body'});

    //Find the Till
    let till = await Till.findById(req.body.tillId).exec().catch( err => {return res.status(500).send({err: 'Internal Server Error', code: 500})});
    if(!till) return res.status(403).send({err: 'Till does not exist', code: 403});

    //Check if Employee is in Till
    let indexofEmployee = till.employees.indexOf(req.body.email);
    if(indexofEmployee === -1) return res.status(404).send({err: 'Employee Not Found in Till', code: 404});

    //Remove Employee and save
    till.employees.splice(indexofEmployee, 1);
    till.save(function(err, tillUpdated){
        if(err) {
            console.log(err);
            return res.status(500).send({err: 'Internal Server Error', code: 500});
        }
        let formattedTill = {
            id: till._id.toString(),
            loginId: till.loginId,
            name: till.name,
            managerPassword: till.managerPassword,
            employees: till.employees,
            tabs: till.tabs,
            props: till.props
        }
        return res.status(200).send({formattedTill, code: 200}); 
    });
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
router.post('/tabs', verifyJWTAdmin, async function(req, res){
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
router.post('/props', verifyJWTAdmin, async function(req, res){
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let find_till = await Till.findOne({name: req.body.name}).exec();
    if(!find_till) return res.status(403).send({err: 'Till does not exist', code: 403});
});

module.exports = router;