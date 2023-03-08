const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/auth');
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const Till = require('../models/Till');
const Employee = require('../models/Employee');


/**
 * Get a employee from email
 *
 * @route POST /employee/get
 * @expects JWT in header of request, email in JSON in body of request
 * @success 200 GET, returns {formattedEmployee, code}
 * @error 400 Bad Request, No Request Body passed
 *        401 Unauthorized, Invalid Token
 *        404 Not Found, Employee not found
 *        500 Internal Server Error
 */
router.post('/get', verifyJWT, function(req, res){
    //Check if req body exists
    if(!req.body) return res.status(400).send({err: 'No request body', code: 400});

    let email = req.body.email;

    //Attempt to find employee and return it
    Employee.findOne({email: email}, function(err, employee){
        if(err){
            console.log(err);
            return res.status(500).send({err: 'Internal Server Error', code: 500});
        } else {
            //If employee not found
            if(employee === null) return res.status(404).send({err: `Employee does not exist`, code: 404});
            let formattedEmployee = {
                id: employee._id,
                email: employee.email,
                isManager: employee.isManager,
                employeeId: employee.employeeId
            };
            return res.status(200).send({formattedEmployee, code: 200});
        }
    })
});


/**
 * Create a employee from employee info
 *
 * @route POST /employee/create
 * @expects JWT in header of request, email & isManager in JSON in body of request
 * @success 201 Created, returns {formattedEmployee, code}
 * @error 400 Bad Request, No Request Body passed
 *        401 Unauthorized, Invalid Token
 *        403 Forbidden, Employee already exists
 *        500 Internal Server Error
 */
router.post('/create', verifyJWT, async (req, res) => {
    //check if req body exists 
    if(!req.body) return res.status(400).send({err: 'No request body'});

    //Construct new employee
    let new_employee = new Employee({
        email: req.body.email,
        isManager: req.body.isManager
    });

    //Check if an employee in the system already has that email
    let find_employee = await Employee.findOne({email: req.body.email}).exec().catch( err => {return res.status(500).send({err: 'Internal Server Error', code: 500});});
    if(find_employee) return res.status(403).send({err: 'Employee already exists', code: 403});

    //Attempt to save the new employee
    new_employee.save(function(err, employee) {
        if(err) {
            console.log(err);
            return res.status(500).send({err: 'Internal Server Error', code: 500});
        }
        //formats the return object to send to frontend
        let formattedEmployee = {
            id: employee._id.toString(),
            email: employee.email,
            isManager: employee.isManager
        }
        return res.status(201).send({formattedEmployee, code: 201});
    });
});


/**
 * Modify an employee's isManager field
 *
 * @route POST /employee/editmanager
 * @expects 
 * @success 
 * @error 
 */
router.post('/editmanager', verifyJWT, async (req, res) => {
    if(!req.body) return res.status(400).send({err: 'No request body'});

    //Check if an employee in the system already has that email
    let foundEmployee = await Employee.findOne({email: req.body.email}).exec().catch( err => {return res.status(500).send({err: 'Internal Server Error', code: 500});});
    if(!foundEmployee) return res.status(404).send({err: 'Employee not found', code: 404});

    //Update info & save
    foundEmployee.isManager = req.body.isManager;
    foundEmployee.save(function(err, employee){
        if(err){
            console.log(err);
            return res.status(500).send({err: 'Internal Server Error', code: 500});
        }
        //formats the return object to send to frontend
        let formattedEmployee = {
            id: employee._id.toString(),
            email: employee.email,
            isManager: employee.isManager
        }
        return res.status(201).send({formattedEmployee, code: 201});
    });
});

module.exports = router;