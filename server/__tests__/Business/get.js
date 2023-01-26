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

describe('POST /get', () => {
    it('should return 201 and business', async () => {
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
            .expect(201)
            .send()
        expect(getBusiness._body.formattedBus).toBeDefined();
        expect(getBusiness._body.code).toBe(201);
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