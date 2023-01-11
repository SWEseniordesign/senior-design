const express = require('express');
const router = express.Router();
const Till = require('../models/Till');

/*
Gets a till
*/
router.post('/get', function(req, res){
    let name = req.body.name;
    Till.findOne({name: name}, function(err, till){
        if(err){
            console.log(err);
        } else {
            res.json(till);
        }
    })
});

/*
Posts a till
*/
router.post('/create', async (req, res) => {
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let new_till = new Till({
        name: req.body.name,
        managerPassword: req.body.managerPassword,
        employees: req.body.employees,
        tabs: req.body.tabs,
        props: req.body.props
    });

    let find_till = await Till.findOne({name: req.body.name}).exec();
    if(find_till) return res.status(403).send({err: 'till already exists', code: 403});

    new_till.save(function(err, savedTill) {
        if(err) {
            console.log(err);
            return res.status(500).send();
        }
        return res.status(201).send(true);
    });
});

/*
Modify a till's employees
TODO
*/
router.post('/employees', async function(req, res){
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let find_till = await Till.findOne({name: req.body.name}).exec();
    if(!find_till) return res.status(403).send({err: 'Till does not exist', code: 403});
});

/*
Modify a till's tabs
TODO
*/
router.post('/tabs', async function(req, res){
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let find_till = await Till.findOne({name: req.body.name}).exec();
    if(!find_till) return res.status(403).send({err: 'Till does not exist', code: 403});
});

/*
Modify a till's props
TODO
*/
router.post('/props', async function(req, res){
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let find_till = await Till.findOne({name: req.body.name}).exec();
    if(!find_till) return res.status(403).send({err: 'Till does not exist', code: 403});
});

module.exports = router;