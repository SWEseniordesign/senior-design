const express = require('express');
const router = express.Router();
const Business = require('../models/Business');
const User = require('../models/User');
const verifyJWT = require('../middleware/auth');


/**
 * Gets a business from stored JWT
 *
 * @route POST /business/get
 * @expects JWT in header of request
 * @success 200 OK, returns {formattedBus, code}
 * @error 401 Unauthorized, Invalid Token
 *        403 Forbidden, User does not exist
 *        404 Not Found, User has no business
 *        500 Internal Server Error
 */
router.post('/get', verifyJWT, async function(req, res){
    //Find user from JWT
    let user = await User.findOne({email: req.user.email}).exec().catch( err => {return res.status(500).send({err: 'Internal Server Error', code: 500})});
    if(user === null) return res.status(403).send({err: 'User does not exist', code: 403});

    //Find the business then format it and return
    Business.findOne({ownerId: user._id}, function(err, business){
        if(err){
            console.log(err);
            return res.status(500).send({err: 'Internal Server Error', code: 500});
        } else {
            //If business is not found
            if(business === null) return res.status(404).send({err: `Business associated to User does not exist`, code: 404});
            let formattedBus = {
                id: business._id,
                name: business.name,
                ownerId: business.ownerId,
                type: business.type,
                admins: business.admins,
                tills: business.tills
            };
            return res.status(200).send({formattedBus, code: 200});
        }
    })
});


/**
 * Creates a business from JSON object
 *
 * @route POST /business/create
 * @expects JWT in header of request
 * @success 201 Created, returns {formattedBus, code}
 * @error 400 Bad Request, No Request body passed
 *        401 Unauthorized, Invalid Token
 *        403 Forbidden: User does not exist
 *        403 Forbidden, User already has a business
 *        403 Forbidden, Business already exists with provided name
 *        404 Not Found, User has no business
 *        500 Internal Server Error
 */
router.post('/create', verifyJWT, async (req, res) => {
    //Check if there is a body in the request
    if(!req.body) return res.status(400).send({err: 'No request body', code: 400});

    //Check if a user exist & if they have a businessId assigned to them
    let user = await User.findOne({email: req.user.email}).exec().catch( err => {return res.status(500).send({err: 'Internal Server Error', code: 500})});
    if(user === null) return res.status(403).send({err: 'User does not exist', code: 403});
    if(user.businessId !== null) return res.status(403).send({err: 'User has a business ID', code: 403});

    //Create temp new business
    let new_business = new Business({
        name: req.body.name,
        ownerId: user._id,
        type: req.body.type,
        admins: req.body.admins,
        tills: req.body.tills
    });

    //Check if a business with the same name exists
    let findBusinessDup = await Business.findOne({name: req.body.name}).exec();
    if(findBusinessDup !== null) return res.status(403).send({err: 'Business already exists', code: 403});

    //Attempt to save the business
    new_business.save(function(err, business) {
        if(err) {
            console.log(err);
            return res.status(500).send({err: 'Internal Server Error', code: 500});
        }
        let formattedBus = {
            id: business._id,
            name: business.name,
            ownerId: business.ownerId,
            type: business.type,
            admins: business.admins,
            tills: business.tills
        };
        //Update owner to inlcude the businessId
        user.businessId = formattedBus.id;
        user.save(function(err, owner){
            if(err) {
                console.log(err);
                return res.status(500).send({err: 'Internal Server Error', code: 500});
            }
        });
        return res.status(201).send({formattedBus, code: 201});
    });
});


/**
 * TODO: re-think this request, may need total overhaul, not working, errors not solidified
 * Modify a businesses' admins from JSON object
 *
 * @route POST /business/admins
 * @expects JWT in header of request
 * @success 200 POST, returns {formattedBus, code}
 * @error 400 Bad Request, No Request body passed
 *        401 Unauthorized, Invalid Token
 *        403 Forbidden: User does not exist
 *        403 Forbidden, User already has a business
 *        403 Forbidden, Business already exists with provided name
 *        404 Not Found, User has no business
 *        500 Internal Server Error
 */
router.post('/admins', verifyJWT, async function(req, res){
    if(!req.body) return res.status(400).send({err: 'No request body'});

    //checks if the users exist
    let result = await User.find({ '_id': { $in: req.body.admins } });
    if(result.length !== req.body.admins.length) return res.status(400).send({err: 'Unable to find admin(s)', code: 403});
    
    //checks if the admin to be added is already an admin of that business
    Business.findOne({name: req.body.name}, function(err, business){
        if(err){
            console.log(err);
        } else {
            req.body.admins.forEach(admin => {
                const index = business.admins.indexOf(admin);
                if (index > -1) {
                    req.body.admins.splice(index, 1); // 2nd parameter means remove one item only
                }
            });
        }
    })

    //gets the business and adds the admins
    let update = await Business.findOneAndUpdate({name: req.body.name}, {$push: {admins: req.body.admins}}, { new: true });
    if(!update) return res.status(400).send({err: 'Unable to update businesses admins', code: 403});

    update.save(function(err, business) {
        if(err) {
            console.log(err);
            return res.status(500).send({err: 'Internal Server Error', code: 500});
        }
        let formattedBus = {
            id: business._id,
            name: business.name,
            ownerId: business.ownerId,
            type: business.type,
            admins: business.admins,
            tills: business.tills
        };
        return res.status(200).send({formattedBus, code: 200});
    });
});


/**
 * TODO: not implemented & not working; expects, success, & error not solidified
 * Modify a businesses' tills from JSON object
 *
 * @route POST /business/edittills
 * @expects JWT in header of request
 * @success 200 POST, returns {formattedBus, code}
 * @error 
 */
router.post('/edittills', verifyJWT, async function(req, res){
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let find_business = await Business.findOne({email: req.body.name}).exec();
    if(find_business) return res.status(403).send({err: 'Business already exists', code: 403});
});


/**
 * TODO: not implemented & not working; expects, success, & error not solidified
 * Get a businesses' tills from JSON object
 *
 * @route POST /business/edittills
 * @expects JWT in header of request
 * @success 200 GET, returns {formattedBus, code}
 * @error 
 */
router.post('/tills', verifyJWT, async function(req, res){
    if(!req.body) return res.status(400).send({err: 'No request body'});

    let find_business = await Business.findOne({email: req.body.name}).exec();
    if(find_business) return res.status(403).send({err: 'Business already exists', code: 403});
});

module.exports = router;