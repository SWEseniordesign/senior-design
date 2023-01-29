const {testUser} =  require('../../testhelper/variables');
const cleanDatabase = require("../../testhelper/cleandatabase");
const request = require('supertest');
const app = require('../../server');
const mongoose = require('mongoose');

afterAll(async () => {
    await cleanDatabase();
    mongoose.disconnect();
}, 10000);

describe('/register', () => {
    it('should return 400 if no request body is sent', async () => {
        const res = await request(app)
            .post('/user/register')
            .expect(400)
            .send() 
        expect(res.body).toEqual({err: 'No request body', code: 400});
    });

    it('should return 201 if user is successfully registered', async () => {
            const res = await request(app)
                .post('/user/register')
                .expect(201)
                .send(testUser) 
            expect(res.body).toEqual(true);
    });

    it('should return 403 if user already exists', async () => {
        const res = await request(app)
            .post('/user/register')
            .expect(403)
            .send(testUser) 
        expect(res.body).toEqual({err: 'User already exists', code: 403});
    });
});