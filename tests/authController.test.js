const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Authentication Controller Tests', () => {
  let authToken; // To store the JWT token for authenticated requests

  describe('POST /api/auth/register', () => {
    it('should register a new user', (done) => {
      chai.request(app)
        .post('/api/auth/register')
        .send({ username: 'testuser', password: 'testpassword' })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('token');
          done();
        });
    });

    it('should handle duplicate registration', (done) => {
      chai.request(app)
        .post('/api/auth/register')
        .send({ username: 'testuser', password: 'testpassword' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('POST /api/auth/login', () => {
    it('should log in an existing user and return a token', (done) => {
      chai.request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'testpassword' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
          authToken = res.body.token; // Save token for subsequent authenticated requests
          done();
        });
    });

    it('should handle invalid credentials', (done) => {
      chai.request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'wrongpassword' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should handle non-existing user', (done) => {
      chai.request(app)
        .post('/api/auth/login')
        .send({ username: 'nonexistentuser', password: 'somepassword' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh the access token', (done) => {
      chai.request(app)
        .post('/api/auth/refresh')
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
          done();
        });
    });

    it('should handle refresh without authentication', (done) => {
      chai.request(app)
        .post('/api/auth/refresh')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

});
