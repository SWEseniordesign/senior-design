const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const verifyJWT = require('../middleware/auth');

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
 * TODO: link employees to a specified Till
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
    let find_employee = await Employee.findOne({email: req.body.email}).exec();
    if(find_employee) return res.status(403).send({err: 'Employee already exists', code: 403});

    //Attempt to save the new employee
    new_employee.save(function(err, employee) {
        if(err) {
            console.log(err);
            return res.status(500).send({err: 'Internal Server Error', code: 500});
        }
        else {
            //formats the return object to send to frontend
            let formattedEmployee = {
                id: employee._id,
                email: employee.email,
                isManager: employee.isManager,
                employeeId: employee.employeeId
            };
            return res.status(201).send({formattedEmployee, code: 201});
        }
    });
});

/**
 * TODO: not implemented
 * Modify an employee's isManager field
 *
 * @route POST /employee/manager
 * @expects 
 * @success 
 * @error 
 */
router.post('/manager', verifyJWT, async (req, res) => {
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let find_employee = await Employee.findOne({email: req.body.email}).exec();
    if(!find_employee) return res.status(403).send({err: 'Employee does not exist', code: 403});
});

module.exports = router;