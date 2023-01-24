const request = require('supertest');
const app = require('../../server');
const mongoose = require('mongoose');

afterAll(() => mongoose.disconnect(), 10000);

describe('POST /business', () => {

    it('should return 201 and true if valid credentials are sent & user has business', async () => {
        const userData = { email: 'dcampb13@unb.ca', password: 'mainaccount' }; 

        const login = await request(app)
            .post('/user/login')
            .expect(200)
            .send(userData) 
        expect(login.body.token).toBeDefined();  

        const business = await request(app)
            .post('/user/business')
            .set('authorization', login.body.token) 
            .expect(201)
            .send()
        expect(business).toBe({business: true, code: 201});  
    });  
});