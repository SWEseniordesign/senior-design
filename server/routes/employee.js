const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

/*
    * DONE
    ? Does the implementation of employee need to change when we start logging them into tills? Should we should their objectId?
    Gets an employee from an email
*/
router.post('/get', function(req, res){
    //Check if req body exists
    if(!req.body) return res.status(400).send({err: 'No request body', code: 400});

    let email = req.body.email;

    //Attempt to find employee and return it
    Employee.findOne({email: email}, function(err, employee){
        if(err){
            console.log(err);
            return res.status(500).send({err: 'Unable to find employee', code: 500});
        } else {
            //If employee not found
            if(employee === null) return res.status(404).send({err: `Employee does not exist`, code: 404});
            let formattedEmployee = {
                id: employee._id,
                email: employee.email,
                isManager: employee.isManager,
                employeeId: employee.employeeId
            };
            return res.status(201).send({formattedEmployee, code: 201});
        }
    })
});

/*
    * DONE
    Posts an employee with an email and isManager
*/
router.post('/create', async (req, res) => {
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
            return res.status(500).send({err: 'Unable to save employee', code: 500});
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

/*
    TODO
    Modify an employees isManager field
*/
router.post('/manager', async (req, res) => {
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let find_employee = await Employee.findOne({email: req.body.email}).exec();
    if(!find_employee) return res.status(403).send({err: 'Employee does not exist', code: 403});
});

module.exports = router;