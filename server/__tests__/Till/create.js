const deleteDocuments = require("../../dbhelper/deletedocs");
const request = require('supertest');
const app = require('../../server');
const mongoose = require('mongoose');

const testUser = {
    fname: 'Test',
    lname: 'User',
    email: 'run_test@gmail.com',
    password: 'peanut_butter_baby',
    businessId: null
};

const testUser1 = {
    fname: 'Test',
    lname: 'User',
    email: 'run_test1@gmail.com',
    password: 'peanut_butter_baby',
    businessId: null
};

const testBusiness = {
    name: 'Walmart',
    type: 'Wholesale',
    admins: [],
    tills: []
};

const testTill = {
    name: 'Sandwiches',
    managerPassword: 123,
    employees: [],
    tabs: [],
    props: [],
    businessId: ''
};

beforeAll(async () => {
    const res = await request(app)
        .post('/user/register')
        .expect(201)
        .send(testUser) 
    expect(res.body).toEqual(true);

    const res1 = await request(app)
        .post('/user/register')
        .expect(201)
        .send(testUser1) 
    expect(res1.body).toEqual(true);
});

afterAll(async () => {
    const result = await deleteDocuments();
    console.log(result);
    mongoose.disconnect()
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

        testTill.businessId = 'fakeId';

        const till = await request(app)
            .post('/till/create')
            .set('authorization', login.body.token) 
            .expect(400)
            .send(testTill)
        expect(till._body.err).toBe('Type 1: Id is not a valid ObjectId');
        expect(till._body.code).toBe(403);
    });

    it('should return 400 for attempting to create a till with a improper string businessId of length 12B', async () => {
        const userData = { email: testUser1.email, password: testUser1.password }; 

        const login = await request(app)
            .post('/user/login')
            .expect(200)
            .send(userData) 
        expect(login.body.token).toBeDefined();  

        testTill.businessId = 'yoyoyoyoyoyo';

        const till = await request(app)
            .post('/till/create')
            .set('authorization', login.body.token) 
            .expect(400)
            .send(testTill)
        expect(till._body.err).toBe('Type 2: Id is not a valid ObjectId');
        expect(till._body.code).toBe(403);
    });

    it('should return 500 for attempting to create a till with a fake businessId of length 12B', async () => {
        const userData = { email: testUser1.email, password: testUser1.password }; 

        const login = await request(app)
            .post('/user/login')
            .expect(200)
            .send(userData) 
        expect(login.body.token).toBeDefined();  

        testTill.businessId = '63d2b33a2a75670dbd74fb3b';

        const till = await request(app)
            .post('/till/create')
            .set('authorization', login.body.token) 
            .expect(500)
            .send(testTill)
        expect(till._body.err).toBe('Business not found');
        expect(till._body.code).toBe(500);
    });
});