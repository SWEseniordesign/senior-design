const {testUser, testUser1, testBusiness, testTill, fakeObjectId, fakeObjectIdType1, fakeObjectIdType2} =  require('../../testhelper/variables');
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

describe('POST /create', () => {
    it('should return 201 and till', async () => {
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

        testTill.businessId = business._body.formattedBus.id;

        const till = await request(app)
            .post('/till/create')
            .set('authorization', login.body.token) 
            .expect(201)
            .send(testTill)
        expect(till._body.formattedTill).toBeDefined();
        expect(till._body.code).toBe(201);
    });

    it('should return 400 for attempting to create duplicate till for a business', async () => {
        const userData = { email: testUser.email, password: testUser.password }; 

        const login = await request(app)
            .post('/user/login')
            .expect(200)
            .send(userData) 
        expect(login.body.token).toBeDefined();  

        const till = await request(app)
            .post('/till/create')
            .set('authorization', login.body.token) 
            .expect(400)
            .send(testTill)
        expect(till._body.err).toBe('Business already has a till with that name');
        expect(till._body.code).toBe(400);
    });

    it('should return 400 for attempting to create a till with a less than 12B businessId', async () => {
        const userData = { email: testUser1.email, password: testUser1.password }; 

        const login = await request(app)
            .post('/user/login')
            .expect(200)
            .send(userData) 
        expect(login.body.token).toBeDefined();  

        testTill.businessId = fakeObjectIdType1;

        const till = await request(app)
            .post('/till/create')
            .set('authorization', login.body.token) 
            .expect(400)
            .send(testTill)
        expect(till._body.err).toBe('Type 1: Id is not a valid ObjectId');
        expect(till._body.code).toBe(400);
    });

    it('should return 400 for attempting to create a till with a improper string businessId of length 12B', async () => {
        const userData = { email: testUser1.email, password: testUser1.password }; 

        const login = await request(app)
            .post('/user/login')
            .expect(200)
            .send(userData) 
        expect(login.body.token).toBeDefined();  

        testTill.businessId = fakeObjectIdType2;

        const till = await request(app)
            .post('/till/create')
            .set('authorization', login.body.token) 
            .expect(400)
            .send(testTill)
        expect(till._body.err).toBe('Type 2: Id is not a valid ObjectId');
        expect(till._body.code).toBe(400);
    });

    it('should return 404 for attempting to create a till with a fake businessId of length 12B', async () => {
        const userData = { email: testUser1.email, password: testUser1.password }; 

        const login = await request(app)
            .post('/user/login')
            .expect(200)
            .send(userData) 
        expect(login.body.token).toBeDefined();  

        testTill.businessId = fakeObjectId;

        const till = await request(app)
            .post('/till/create')
            .set('authorization', login.body.token) 
            .expect(404)
            .send(testTill)
        expect(till._body.err).toBe('Business not found');
        expect(till._body.code).toBe(404);
    });
});