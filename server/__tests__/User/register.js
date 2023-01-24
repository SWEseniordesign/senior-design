const request = require('supertest');
const app = require('../../server');

describe('/register', () => {
    it('should return 400 if no request body is sent', async () => {
        const res = await request(app)
            .post('/user/register')
            .expect(400)
            .send() 
        expect(res.body).toEqual({err: 'No request body', code: 400});
    });

    it('should return 403 if user already exists', async () => {

        let testUser = {
            fname: 'Test',
            lname: 'User',
            email: 'dcampb13@unb.ca',
            password: '',
            businessId: null
        }

        const res = await request(app)
            .post('/user/register')
            .expect(403)
            .send(testUser) 
        expect(res.body).toEqual({err: 'User already exists', code: 403});
    });

    it('should return 201 if user is successfully registered', async () => {
        let testUser = {
            fname: 'Test',
            lname: 'User',
            email: 'run_test@gmail.com',
            password: 'peanut_butter_baby',
            businessId: null
        }

        const res = await request(app)
            .post('/user/register')
            .expect(201)
            .send(testUser) 
        expect(res.body).toEqual(true);
    }); 					  
});