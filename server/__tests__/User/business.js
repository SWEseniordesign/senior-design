import { deleteDocuments } from "../dbhelper/deletedocs";
const request = require('supertest');
const app = require('../../server');
const mongoose = require('mongoose');



afterAll(() => {
    const result = deleteDocuments();
    console.log(result);
    mongoose.disconnect()
}, 10000);

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
        expect(business._body.business).toBe(true);
        expect(business._body.code).toBe(201);
    });

    it('should return 201 and false if valid credentials are sent & user does not have a business', async () => {
        const userData = { email: 'jimmy@joe.j', password: 'jimmy' }; 

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
        expect(business._body.business).toBe(false);
        expect(business._body.code).toBe(201);
    }); 
});