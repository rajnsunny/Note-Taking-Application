const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const Note = require('../app/models/note'); // Assuming the model is defined in Note.js

chai.use(chaiHttp);
const expect = chai.expect;

describe('Search Routes Tests', () => {
  let authToken; // To store the JWT token for authenticated requests

  before((done) => {
    // Log in a user and obtain an authentication token
    chai.request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'testpassword' })
      .end((err, res) => {
        authToken = res.body.token;
        done();
      });
  });

  describe('GET /api/search?q=:query', () => {
    it('should perform a keyword search for notes for the authenticated user', (done) => {
      // Assume you have test notes to search through (create them if needed)
      chai.request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test Note 1', content: 'This is a test note about coding.' })
        .end(() => {
          chai.request(app)
            .post('/api/notes')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ title: 'Test Note 2', content: 'This is another test note about programming.' })
            .end(() => {
              chai.request(app)
                .get('/api/search?q=coding')
                .set('Authorization', `Bearer ${authToken}`)
                .end((err, res) => {
                  expect(res).to.have.status(200);
                  expect(res.body).to.have.property('results');
                  expect(res.body.results).to.be.an('array');
                  expect(res.body.results).to.have.length.above(0); // Assuming there are matching results
                  done();
                });
            });
        });
    });

    it('should handle searching without authentication', (done) => {
      chai.request(app)
        .get('/api/search?q=programming')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  // Add more test cases for other search-related scenarios

  after((done) => {
    // Clean up: Delete the test notes and any other resources created during testing
    Note.deleteMany({}, (err) => {
      if (err) {
        console.error('Error cleaning up test data:', err);
      }
      done();
    });
  });
});
