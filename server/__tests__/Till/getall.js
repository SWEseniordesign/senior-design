const {testUser, testUser1, testUser2, testUser3, testUserBusId, testBusiness, testBusiness2, testBusinessType2, testTill, testTill2} =  require('../../testhelper/variables');
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

describe('POST /getall', () => {
    it('should return 200 and till(s)', async () => {
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

        const till1 = await request(app)
            .post('/till/create')
            .set('authorization', login.body.token) 
            .expect(201)
            .send(testTill)
        expect(till1._body.formattedTill).toBeDefined();
        expect(till1._body.code).toBe(201);

        testTill2.businessId = business._body.formattedBus.id;

        const till2 = await request(app)
            .post('/till/create')
            .set('authorization', login.body.token) 
            .expect(201)
            .send(testTill2)
        expect(till2._body.formattedTill).toBeDefined();
        expect(till2._body.code).toBe(201);

        const getAllTills = await request(app)
            .post('/till/getall')
            .set('authorization', login.body.token) 
            .expect(200)
            .send()
        expect(getAllTills._body.business.name).toBe(testBusiness.name);
        expect(getAllTills._body.tills.length).toBe(2);
        expect(getAllTills._body.tills[0].id).toBe(till1._body.formattedTill.id);
        expect(getAllTills._body.tills[1].id).toBe(till2._body.formattedTill.id);
    });

    it('should return 403 for attempting user with no businessId', async () => {
        const userData = { email: testUser1.email, password: testUser1.password }; 

        const login = await request(app)
            .post('/user/login')
            .expect(200)
            .send(userData) 
        expect(login.body.token).toBeDefined();  

        const getAllTills = await request(app)
            .post('/till/getall')
            .set('authorization', login.body.token) 
            .expect(403)
            .send()
        expect(getAllTills._body.err).toBe('User does not have a business');
        expect(getAllTills._body.code).toBe(403);
    });

    it('should return 404 for attempting user with fake businessId', async () => {
        const userData = { email: testUserBusId.email, password: testUserBusId.password }; 

        const login = await request(app)
            .post('/user/login')
            .expect(200)
            .send(userData) 
        expect(login.body.token).toBeDefined();  

        const getAllTills = await request(app)
            .post('/till/getall')
            .set('authorization', login.body.token) 
            .expect(404)
            .send()
        expect(getAllTills._body.err).toBe('Business does not exist');
        expect(getAllTills._body.code).toBe(404);
    });

    it('should return 404 for attempting to get a till with a invalid tillId', async () => {
        const userData = { email: testUser2.email, password: testUser2.password }; 

        const login = await request(app)
            .post('/user/login')
            .expect(200)
            .send(userData) 
        expect(login.body.token).toBeDefined();

        const businessType2 = await request(app)
            .post('/business/create')
            .set('authorization', login.body.token) 
            .expect(201)
            .send(testBusinessType2)
        expect(businessType2._body.formattedBus).toBeDefined();
        expect(businessType2._body.code).toBe(201);

        const getAllTills = await request(app)
            .post('/till/getall')
            .set('authorization', login.body.token) 
            .expect(404)
            .send()
        expect(getAllTills._body.err).toBe('Till does not exist');
        expect(getAllTills._body.code).toBe(404);
    });

    it('should return 404 for attempting to get tills from business with no tillIds', async () => {
        const userData = { email: testUser3.email, password: testUser3.password }; 

        const login = await request(app)
            .post('/user/login')
            .expect(200)
            .send(userData) 
        expect(login.body.token).toBeDefined();

        const business = await request(app)
            .post('/business/create')
            .set('authorization', login.body.token) 
            .expect(201)
            .send(testBusiness2)
        expect(business._body.formattedBus).toBeDefined();
        expect(business._body.code).toBe(201);

        const getAllTills = await request(app)
            .post('/till/getall')
            .set('authorization', login.body.token) 
            .expect(404)
            .send()
        //console.log(getAllTills._body);
        expect(getAllTills._body.err).toBe('Business does not have tills');
        expect(getAllTills._body.code).toBe(404);
    });
});