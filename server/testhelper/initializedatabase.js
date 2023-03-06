const {testUser, testUser1, testUser2, testUser3, testUserBusId, testBusiness, testTill, testTab, testCard, testItem} = require('./variables');
const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const { exit } = require('process');


/**
 * If the script run is the 'yarn initdb' script, initialize the database
 */
if(process.env.npm_lifecycle_event === 'dbscript'){
    startDBInitialization();
}


/**
 * Starts initialization of populating database
 *
 * @success Creates data, closes connection, & ends process
 * @error 401 Unauthorized, Invalid Token
 *        404 Not Found, User has no business
 *        403 Forbidden, User does not exist
 *        500 Internal Server Error
 */
async function startDBInitialization(){
    await initializeDatabaseNewScript();
    await closeConnections();
}


/**
 * Creates data in connected database
 *
 * @success Creates data
 * @error 401 Unauthorized, Invalid Token
 *        404 Not Found, User has no business
 *        403 Forbidden, User does not exist
 *        500 Internal Server Error
 */
async function initializeDatabaseNewScript(){
    console.log('Creating data:')
    const user1 = await request(app)
        .post('/user/register')
        //.expect(201)
        .send(testUser);
    if(user1._body.err != null){
        console.log(`\tError creating User: ${user1._body.err}.`);
        console.log('\tStopping data creation...');
        return;
    }

    const loginUser1 = await request(app)
        .post('/user/login')
        //.expect(200)
        .send({email: testUser.email, password: testUser.password});
    if(loginUser1._body.err != null){
        console.log(`\tError logging in User: ${loginUser1._body.err}.`);
        console.log('\tStopping data creation...');
        return;
    }

    const businessUser1 = await request(app)
        .post('/business/create')
        .set('authorization', loginUser1.body.token) 
        //.expect(201)
        .send(testBusiness);
    if(businessUser1._body.err != null){
        console.log(`\tError creating Business: ${businessUser1._body.err}.`);
        console.log('\tStopping data creation...');
        return;
    }

    testTill.businessId = businessUser1._body.formattedBus.id;
    const tillUser1 = await request(app)
        .post('/till/create')
        .set('authorization', loginUser1.body.token) 
        //.expect(201)
        .send(testTill);
    if(tillUser1._body.err != null){
        console.log(`\tError creating Till: ${tillUser1._body.err}.`);
        console.log('\tStopping data creation...');
        return;
    }

    testTab.tillId = tillUser1._body.formattedTill.id;
    const tabUser1 = await request(app)
        .post('/tab/create')
        .set('authorization', loginUser1.body.token) 
        //.expect(201)
        .send(testTab);
    if(tabUser1._body.err != null){
        console.log(`\tError creating Tab: ${tabUser1._body.err}.`);
        console.log('\tStopping data creation...');
        return;
    }

    testCard.tabId = tabUser1._body.formattedTab.id;
    const cardUser1 = await request(app)
        .post('/card/create')
        .set('authorization', loginUser1.body.token) 
        //.expect(201)
        .send(testCard);
    if(cardUser1._body.err != null){
        console.log(`\tError creating Card: ${cardUser1._body.err}.`);
        console.log('\tStopping data creation...');
        return;
    }

    testItem.cardId = cardUser1._body.formattedCard.id;
    const itemUser1 = await request(app)
        .post('/items/create')
        .set('authorization', loginUser1.body.token) 
        //.expect(201)
        .send(testItem);
    if(itemUser1._body.err != null){
        console.log(`\tError creating Item: ${itemUser1._body.err}.`);
        console.log('\tStopping data creation...');
        return;
    }
    console.log('\tData created successfully.');
}


/**
 * TODO: remove this functionality in ON-122 to use new script
 * Initializes database for running unit tests
 *
 * @success Creates data
 * @error Error creating users
 */
async function initializeDatabase(){
    try{
        const user1 = await request(app)
            .post('/user/register')
            .expect(201)
            .send(testUser);

        const user2 = await request(app)
            .post('/user/register')
            .expect(201)
            .send(testUser1);

        const user3 = await request(app)
            .post('/user/register')
            .expect(201)
            .send(testUserBusId);

        const user4 = await request(app)
            .post('/user/register')
            .expect(201)
            .send(testUser2);

        const user5 = await request(app)
            .post('/user/register')
            .expect(201)
            .send(testUser3);
    }
    catch(e){
        return {err: 'Error creating users'};
    }
}


/**
 * Closes the connection to the database and ends the process
 *
 * @success Disconnects from database and ends process
 * @error Error closing the database
 */
async function closeConnections(){
    try{
        await mongoose.disconnect();
        console.log('Disconnecting from database...');
        if(mongoose.connection.readyState === 0){
            console.log("\tDatabase connection successfully closed.");
        }
        else {
            console.log('\tError closing database connection, closing process...');
            process.exit(1); 
        }
        
        console.log('\tExiting process...');
        process.exit(0);
    }
    catch(err){
        console.error(err);
        process.exit(1);
    }
}

module.exports = initializeDatabase;