const {testUser, testUser1, testBusiness} =  require('../../testhelper/variables');
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

describe('POST /get', () => {
    it('should return 200 and business', async () => {
        const userData = { email: testUser.email, password: testUser.password }; 
        
        const login = await request(app)
            .post('/user/login')
            .expect(200)
            .send(userData) 
        expect(login.body.token).toBeDefined();  

        const business = await request(app)
            .post('/business/create')
            .set('authorization', login.body.token) 
            .expect(201)
            .send(testBusiness)
        expect(business._body.formattedBus).toBeDefined();
        expect(business._body.code).toBe(201);

        const getBusiness = await request(app)
            .post('/business/get')
            .set('authorization', login.body.token) 
            .expect(200)
            .send()
        expect(getBusiness._body.formattedBus).toBeDefined();
        expect(getBusiness._body.code).toBe(200);
    });

    it('should return 404 for attempting to find Business which doesn\'t exist', async () => {
        const userData = { email: testUser1.email, password: testUser1.password }; 

        const login = await request(app)
            .post('/user/login')
            .expect(200)
            .send(userData) 
        expect(login.body.token).toBeDefined();  

        const business = await request(app)
            .post('/business/get')
            .set('authorization', login.body.token) 
            .expect(404)
            .send()
        expect(business._body.err).toBe('Business associated to User does not exist');
        expect(business._body.code).toBe(404);
    });
});