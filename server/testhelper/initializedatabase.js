const {testUser, testUser1, testUserBusId} = require('./variables');
const request = require('supertest');
const app = require('../server');

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
    }
    catch(e){
        return {err: 'Error creating users'};
    }
}
module.exports = initializeDatabase;