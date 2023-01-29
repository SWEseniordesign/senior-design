const {testUser, testEmployee} =  require('../../testhelper/variables');
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
    it('should return 201 and if valid credentials are sent', async () => {
        const userData = { email: testUser.email, password: testUser.password }; 

        const login = await request(app)
            .post('/user/login')
            .expect(200)
            .send(userData) 
        expect(login.body.token).toBeDefined();  

        const employee = await request(app)
            .post('/employee/create')
            .set('authorization', login.body.token) 
            .expect(201)
            .send(testEmployee) 
        expect(employee._body.formattedEmployee).toBeDefined();
        expect(employee._body.code).toBe(201);

        const getEmployee = await request(app)
            .post('/employee/get')
            .set('authorization', login.body.token) 
            .expect(201)
            .send(testEmployee) 
        expect(getEmployee._body.formattedEmployee).toBeDefined();
        expect(getEmployee._body.code).toBe(201);
    });

    it('should return 403 for getting fake employee', async () => {
        const userData = { email: testUser.email, password: testUser.password }; 

        const login = await request(app)
            .post('/user/login')
            .expect(200)
            .send(userData) 
        expect(login.body.token).toBeDefined();  

        const getEmployee = await request(app)
            .post('/employee/get')
            .set('authorization', login.body.token) 
            .expect(404)
            .send({email: 'fake@email.ca'}) 
        expect(getEmployee._body.err).toBe('Employee does not exist');
        expect(getEmployee._body.code).toBe(404);
    });
});