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

describe('POST /login', () => {

    it('should return 404 if no request body is sent', async () => {
        const res = await request(app)
            .post('/user/login')
            .expect(400)
            .send() 
        expect(res.body).toEqual({err: 'No request body', code: 400});
    });

    it('should return 400 if invalid password is sent', async () => {
        const userData = { email: testUser.email, password: 'incorrectPass' };
        const res = await request(app)
            .post('/user/login')
            .expect(404)
            .send(userData) 
        expect(res.body).toEqual({err: 'Invalid email or password', code: 404});
    });

    it('should return 404 if invalid email is sent', async () => {
        const userData = { email: 'incorrect@email.ca', password: testUser.password };
        const res = await request(app)
            .post('/user/login')
            .expect(404)
            .send(userData) 
        expect(res.body).toEqual({err: 'Invalid email or password', code: 404});
    });

    it('should return 200 and token if valid credentials are sent', async () => {
        const userData = { email: testUser.email, password: testUser.password }; 
        const res = await request(app)
            .post('/user/login')
            .expect(200)
            .send(userData) 
        expect(res.body.token).toBeDefined();  
        expect(res.body.code).toBe(200); 
    });  
});