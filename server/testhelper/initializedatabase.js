const {testUser, testUser1, testUserBusId} = require('./variables');
const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
//const disconnectDB = require('../config/db');
if(process.env.npm_lifecycle_event === 'dbscript'){
    start();
}

async function start(){
    await initializeDatabase();
     try{
         await mongoose.disconnect();
         console.log('Disconnecting from database...');
        if(mongoose.connection.readyState === 0){
            console.log("Database connection successfully closed.");
        }
        else {
            console.log('Error closing database connection, closing process...');
            process.exit(1); 
        }
        
        console.log('Exiting process...');
        process.exit(0);
    }
    catch(err){
        console.error(err);
        process.exit(1);
    }
}


async function initializeDatabase(){
    try{
        /*const user1 = await request(app)
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
            .send(testUserBusId);*/
    }
    catch(e){
        return {err: 'Error creating users'};
    }
}

module.exports = initializeDatabase;