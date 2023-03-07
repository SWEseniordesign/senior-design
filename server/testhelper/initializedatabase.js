const {testUser, testUser1, testUser2, testUser3, testUserBusId, testTill2, 
    testBusiness, testTill, testTabPizza, testCardClassicPizza, testItem1CP, testItem2CP, 
    testCardSpecialityPizza, testItem1SP, testItem2SP,
    testTabSandwiches, testCardBurgers, testItem1B, testItem2B,
    testCardClassicSand, testItem1C, testItem2C
} = require('./variables');
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
    const till1User1 = await request(app)
        .post('/till/create')
        .set('authorization', loginUser1.body.token) 
        //.expect(201)
        .send(testTill);
    if(till1User1._body.err != null){
        console.log(`\tError creating Till: ${till1User1._body.err}.`);
        console.log('\tStopping data creation...');
        return;
    }

    testTill2.businessId = businessUser1._body.formattedBus.id;
    const till2User1 = await request(app)
        .post('/till/create')
        .set('authorization', loginUser1.body.token) 
        //.expect(201)
        .send(testTill2);
    if(till2User1._body.err != null){
        console.log(`\tError creating Till: ${till2User1._body.err}.`);
        console.log('\tStopping data creation...');
        return;
    }

    //Creates a Tab called Pizza for till1User1
    testTabPizza.tillId = till1User1._body.formattedTill.id;
    const tabPizzaUser1 = await request(app)
        .post('/tab/create')
        .set('authorization', loginUser1.body.token) 
        //.expect(201)
        .send(testTabPizza);
    if(tabPizzaUser1._body.err != null){
        console.log(`\tError creating Tab: ${tabPizzaUser1._body.err}.`);
        console.log('\tStopping data creation...');
        return;
    }
        //Creates a Card called Classic for Pizza Tab
        testCardClassicPizza.tabId = tabPizzaUser1._body.formattedTab.id;
        const cardCPUser1 = await request(app)
            .post('/card/create')
            .set('authorization', loginUser1.body.token) 
            //.expect(201)
            .send(testCardClassicPizza);
        if(cardCPUser1._body.err != null){
            console.log(`\tError creating Card: ${cardCPUser1._body.err}.`);
            console.log('\tStopping data creation...');
            return;
        }   
            //Creates a item for the Classic Tab
            testItem1CP.cardId = cardCPUser1._body.formattedCard.id;
            const itemCP1User1 = await request(app)
                .post('/items/create')
                .set('authorization', loginUser1.body.token) 
                //.expect(201)
                .send(testItem1CP);
            if(itemCP1User1._body.err != null){
                console.log(`\tError creating Item: ${itemCP1User1._body.err}.`);
                console.log('\tStopping data creation...');
                return;
            }
            //Creates a item for the Classic Tab
            testItem2CP.cardId = cardCPUser1._body.formattedCard.id;
            const itemCP2User1 = await request(app)
                .post('/items/create')
                .set('authorization', loginUser1.body.token) 
                //.expect(201)
                .send(testItem2CP);
            if(itemCP2User1._body.err != null){
                console.log(`\tError creating Item: ${itemCP2User1._body.err}.`);
                console.log('\tStopping data creation...');
                return;
            }
        //Creates a Card called Speciality for Pizza Tab
        testCardSpecialityPizza.tabId = tabPizzaUser1._body.formattedTab.id;
        const cardSPUser1 = await request(app)
            .post('/card/create')
            .set('authorization', loginUser1.body.token) 
            //.expect(201)
            .send(testCardSpecialityPizza);
        if(cardSPUser1._body.err != null){
            console.log(`\tError creating Card: ${cardSPUser1._body.err}.`);
            console.log('\tStopping data creation...');
            return;
        }
            //Creates a item for the Speciality Card
            testItem1SP.cardId = cardSPUser1._body.formattedCard.id;
            const itemSP1User1 = await request(app)
                .post('/items/create')
                .set('authorization', loginUser1.body.token) 
                //.expect(201)
                .send(testItem1SP);
            if(itemSP1User1._body.err != null){
                console.log(`\tError creating Item: ${itemSP1User1._body.err}.`);
                console.log(`\tcardId: ${testItem1SP.cardId}`);
                console.log('\tStopping data creation...');
                return;
            }
            //Creates a item for the Speciality Card
            testItem2SP.cardId = cardSPUser1._body.formattedCard.id;
            const itemSP2User1 = await request(app)
                .post('/items/create')
                .set('authorization', loginUser1.body.token) 
                //.expect(201)
                .send(testItem2SP);
            if(itemSP2User1._body.err != null){
                console.log(`\tError creating Item: ${itemSP2User1._body.err}.`);
                console.log(`\tcardId: ${testItem1SP.cardId}`);
                console.log('\tStopping data creation...');
                return;
            }

    //Creates a Tab called Sandwiches for till1User1
    testTabSandwiches.tillId = till1User1._body.formattedTill.id;
    const tabSandwichesUser1 = await request(app)
        .post('/tab/create')
        .set('authorization', loginUser1.body.token) 
        //.expect(201)
        .send(testTabSandwiches);
    if(tabSandwichesUser1._body.err != null){
        console.log(`\tError creating Tab: ${tabSandwichesUser1._body.err}.`);
        console.log('\tStopping data creation...');
        return;
    }
        //Creates a Card called Burgers for Sandwiches Tab
        testCardBurgers.tabId = tabSandwichesUser1._body.formattedTab.id;
        const cardBurgersUser1 = await request(app)
            .post('/card/create')
            .set('authorization', loginUser1.body.token) 
            //.expect(201)
            .send(testCardBurgers);
        if(cardBurgersUser1._body.err != null){
            console.log(`\tError creating Card: ${cardBurgersUser1._body.err}.`);
            console.log('\tStopping data creation...');
            return;
        }
            //Creates a Item for Burgers Card
            testItem1B.cardId = cardBurgersUser1._body.formattedCard.id;
            const itemB1User1 = await request(app)
                .post('/items/create')
                .set('authorization', loginUser1.body.token) 
                //.expect(201)
                .send(testItem1B);
            if(itemB1User1._body.err != null){
                console.log(`\tError creating Item: ${itemB1User1._body.err}.`);
                console.log('\tStopping data creation...');
                return;
            }
            //Creates a Item for Burgers Card
            testItem2B.cardId = cardBurgersUser1._body.formattedCard.id;
            const itemB2User1 = await request(app)
                .post('/items/create')
                .set('authorization', loginUser1.body.token) 
                //.expect(201)
                .send(testItem2B);
            if(itemB2User1._body.err != null){
                console.log(`\tError creating Item: ${itemB2User1._body.err}.`);
                console.log('\tStopping data creation...');
                return;
            }
        //Creates a Card called Classic for Sandwiches Tab
        testCardClassicSand.tabId = tabSandwichesUser1._body.formattedTab.id;
        const cardClassicSandUser1 = await request(app)
            .post('/card/create')
            .set('authorization', loginUser1.body.token) 
            //.expect(201)
            .send(testCardClassicSand);
        if(cardClassicSandUser1._body.err != null){
            console.log(`\tError creating Card: ${cardClassicSandUser1._body.err}.`);
            console.log('\tStopping data creation...');
            return;
        }
            //Creates a Item for Classic Card
            testItem1C.cardId = cardClassicSandUser1._body.formattedCard.id;
            const itemC1User1 = await request(app)
                .post('/items/create')
                .set('authorization', loginUser1.body.token) 
                //.expect(201)
                .send(testItem1C);
            if(itemC1User1._body.err != null){
                console.log(`\tError creating Item: ${itemC1User1._body.err}.`);
                console.log('\tStopping data creation...');
                return;
            }
            //Creates a Item for Classic Card
            testItem2C.cardId = cardClassicSandUser1._body.formattedCard.id;
            const itemC2User1 = await request(app)
                .post('/items/create')
                .set('authorization', loginUser1.body.token) 
                //.expect(201)
                .send(testItem2C);
            if(itemC2User1._body.err != null){
                console.log(`\tError creating Item: ${itemC2User1._body.err}.`);
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