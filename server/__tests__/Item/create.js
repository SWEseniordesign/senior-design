const {testUser, testBusiness, testTill, testTab, testCard, testItem, fakeObjectId, fakeObjectIdType1, fakeObjectIdType2} =  require('../../testhelper/variables');
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
    it('should return 201 and item', async () => {
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

        testItem.cardId = card._body.formattedCard.id;

        const item = await request(app)
            .post('/items/create')
            .set('authorization', login.body.token) 
            .expect(201)
            .send(testItem)
        expect(item._body.formattedItem).toBeDefined();
        expect(item._body.code).toBe(201);
    });

    it('should return 400 for attempting to create an item with a less than 12B cardId', async () => {
        const userData = { email: testUser.email, password: testUser.password }; 

        const login = await request(app)
            .post('/user/login')
            .expect(200)
            .send(userData) 
        expect(login.body.token).toBeDefined();  

        testItem.cardId = fakeObjectIdType1;

        const item = await request(app)
            .post('/items/create')
            .set('authorization', login.body.token) 
            .expect(400)
            .send(testCard)
        expect(item._body.err).toBe('Type 1: Id is not a valid ObjectId');
        expect(item._body.code).toBe(400);
    });

    it('should return 400 for attempting to create an iten with a improper string cardId of length 12B', async () => {
        const userData = { email: testUser.email, password: testUser.password }; 

        const login = await request(app)
            .post('/user/login')
            .expect(200)
            .send(userData) 
        expect(login.body.token).toBeDefined();  

        testItem.cardId = fakeObjectIdType2;

        const item = await request(app)
            .post('/items/create')
            .set('authorization', login.body.token) 
            .expect(400)
            .send(testItem)
        expect(item._body.err).toBe('Type 2: Id is not a valid ObjectId');
        expect(item._body.code).toBe(400);
    });

    it('should return 500 for attempting to create an item with a fake cardId of length 12B', async () => {
        const userData = { email: testUser.email, password: testUser.password }; 

        const login = await request(app)
            .post('/user/login')
            .expect(200)
            .send(userData) 
        expect(login.body.token).toBeDefined();  

        testItem.cardId = fakeObjectId;

        const item = await request(app)
            .post('/items/create')
            .set('authorization', login.body.token) 
            .expect(404)
            .send(testItem)
        expect(item._body.err).toBe('Card not found');
        expect(item._body.code).toBe(404);
    });
});