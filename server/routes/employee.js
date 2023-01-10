const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

/*
Gets an employee from a email
*/
router.get('/get', function(req, res){
    let email = req.body.email;
    Employee.findOne({email: email}, function(err, employee){
        if(err){
            console.log(err);
        } else {
            res.json(employee);
        }
    })
});

/*
Posts an employee with the email and isManager
*/
router.post('/create', async (req, res) => {
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let new_employee = new Employee({
        email: req.body.email,
        isManager: req.body.isManager
    });

    let find_employee = await Employee.findOne({email: req.body.email}).exec();
    if(find_employee) return res.status(403).send({err: 'Employee already exists', code: 403});

    new_employee.save(function(err, savedEmployee) {
        if(err) {
            console.log(err);
            return res.status(500).send();
        }
        return res.status(201).send(true);
    });
});

module.exports = router;