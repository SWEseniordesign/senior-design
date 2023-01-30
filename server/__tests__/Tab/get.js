const {testUser, testUser1, testBusiness, testTill, testTab, fakeObjectId, fakeObjectIdType1, fakeObjectIdType2} =  require('../../testhelper/variables');
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
    it('should return 201 and tab', async () => {
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

        testTab.tillId = till._body.formattedTill.id;

        const tab = await request(app)
            .post('/tab/create')
            .set('authorization', login.body.token) 
            .expect(201)
            .send(testTab)
        expect(tab._body.formattedTab).toBeDefined();
        expect(tab._body.code).toBe(201);

        const getTab = await request(app)
            .post('/tab/get')
            .set('authorization', login.body.token) 
            .expect(201)
            .send({id: tab._body.formattedTab.id})
        expect(getTab._body.formattedTab).toBeDefined();
        expect(getTab._body.code).toBe(201);
    });

    it('should return 400 for attempting to get a tab with a less than 12B tabId', async () => {
        const userData = { email: testUser1.email, password: testUser1.password }; 

        const login = await request(app)
            .post('/user/login')
            .expect(200)
            .send(userData) 
        expect(login.body.token).toBeDefined();  

        const tab = await request(app)
            .post('/tab/get')
            .set('authorization', login.body.token) 
            .expect(400)
            .send({id: fakeObjectIdType1})
        expect(tab._body.err).toBe('Type 1: Id is not a valid ObjectId');
        expect(tab._body.code).toBe(403);
    });

    it('should return 400 for attempting to get a tab with a improper string tabId of length 12B', async () => {
        const userData = { email: testUser1.email, password: testUser1.password }; 

        const login = await request(app)
            .post('/user/login')
            .expect(200)
            .send(userData) 
        expect(login.body.token).toBeDefined();  

        const tab = await request(app)
            .post('/tab/get')
            .set('authorization', login.body.token) 
            .expect(400)
            .send({id: fakeObjectIdType2})
        expect(tab._body.err).toBe('Type 2: Id is not a valid ObjectId');
        expect(tab._body.code).toBe(403);
    });

    it('should return 404 for attempting to get a tab with a fake tabId of length 12B', async () => {
        const userData = { email: testUser1.email, password: testUser1.password }; 

        const login = await request(app)
            .post('/user/login')
            .expect(200)
            .send(userData) 
        expect(login.body.token).toBeDefined();  

        const tab = await request(app)
            .post('/tab/get')
            .set('authorization', login.body.token) 
            .expect(404)
            .send({id: fakeObjectId})
        expect(tab._body.err).toBe('Tab does not exist');
        expect(tab._body.code).toBe(404);
    });
});