const {testUser} =  require('../../testhelper/variables');
const initializeDatabase = require("../../testhelper/initializedatabase");
const cleanDatabase = require("../../testhelper/cleandatabase");
const request = require('supertest');
const app = require('../../server');
const mongoose = require('mongoose');

beforeAll(async () => {
    await initializeDatabase();
});

afterAll(async () => {
    await cleanDatabase();
    mongoose.disconnect();
}, 10000);

/*
    !Note:
        I only wrote one test as the User/login.js file covers the easily caught failure cases 
*/
describe('POST /name', () => {
    it('should return 200 and users name if token is stored', async () => {
        const userData = { email: testUser.email, password: testUser.password }; 
        const login = await request(app)
            .post('/user/login')
            .expect(200)
            .send(userData) 
        expect(login.body.token).toBeDefined();  

        const getName = await request(app)
            .post('/user/name')
            .set('authorization', login.body.token) 
            .expect(201)
            .send() 
        expect(getName.body.formattedUser.fname).toBe('Test');
        expect(getName.body.formattedUser.lname).toBe('User');
        expect(getName.body.code).toBe(201);
    });  
});