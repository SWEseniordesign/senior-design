const {testUser, testUser1, testBusiness, testTill, testTab, testCard, fakeObjectId, fakeObjectIdType1, fakeObjectIdType2} =  require('../../testhelper/variables');
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

        testCard.tabId = tab._body.formattedTab.id;

        const card = await request(app)
            .post('/card/create')
            .set('authorization', login.body.token) 
            .expect(201)
            .send(testCard)
        expect(card._body.formattedCard).toBeDefined();
        expect(card._body.code).toBe(201);
    });

    it('should return 400 for attempting to create a card with a less than 12B tillId', async () => {
        const userData = { email: testUser1.email, password: testUser1.password }; 

        const login = await request(app)
            .post('/user/login')
            .expect(200)
            .send(userData) 
        expect(login.body.token).toBeDefined();  

        testCard.tabId = fakeObjectIdType1;

        const card = await request(app)
            .post('/card/create')
            .set('authorization', login.body.token) 
            .expect(400)
            .send(testCard)
        expect(card._body.err).toBe('Type 1: Id is not a valid ObjectId');
        expect(card._body.code).toBe(403);
    });

    it('should return 400 for attempting to create a card with a improper string tillId of length 12B', async () => {
        const userData = { email: testUser1.email, password: testUser1.password }; 

        const login = await request(app)
            .post('/user/login')
            .expect(200)
            .send(userData) 
        expect(login.body.token).toBeDefined();  

        testCard.tabId = fakeObjectIdType2;

        const card = await request(app)
            .post('/card/create')
            .set('authorization', login.body.token) 
            .expect(400)
            .send(testCard)
        expect(card._body.err).toBe('Type 2: Id is not a valid ObjectId');
        expect(card._body.code).toBe(403);
    });

    it('should return 500 for attempting to create a card with a fake tillId of length 12B', async () => {
        const userData = { email: testUser1.email, password: testUser1.password }; 

        const login = await request(app)
            .post('/user/login')
            .expect(200)
            .send(userData) 
        expect(login.body.token).toBeDefined();  

        testCard.tabId = fakeObjectId;

        const card = await request(app)
            .post('/card/create')
            .set('authorization', login.body.token) 
            .expect(500)
            .send(testCard)
        expect(card._body.err).toBe('Tab not found');
        expect(card._body.code).toBe(500);
    });
});