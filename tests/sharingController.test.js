const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const Share = require('../app/models/share'); // Assuming the model is defined in Share.js

chai.use(chaiHttp);
const expect = chai.expect;

describe('Sharing Controller Tests', () => {
  let authToken; // To store the JWT token for authenticated requests
  let testShareId; // To store the ID of the test share created

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

  describe('POST /api/notes/:noteId/share', () => {
    it('should create a new share for the authenticated user', (done) => {
      // Assume you have a test note to share (create one if needed)
      chai.request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test Note', content: 'This is a test note.' })
        .end((err, res) => {
          const testNoteId = res.body.note._id;

          chai.request(app)
            .post(`/api/notes/${testNoteId}/share`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ recipient: 'recipientuser' }) // Replace with a valid username
            .end((err, res) => {
              expect(res).to.have.status(201);
              expect(res.body).to.have.property('share');
              testShareId = res.body.share._id; // Save ID for subsequent tests
              done();
            });
        });
    });

    it('should handle creating a share without authentication', (done) => {
      chai.request(app)
        .post('/api/notes/testNoteId/share')
        .send({ recipient: 'recipientuser' }) // Replace with a valid username
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('GET /api/notes/:noteId/share', () => {
    it('should get info about a shared note for the authenticated user', (done) => {
      chai.request(app)
        .get(`/api/notes/${testShareId}/share`)
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('share');
          done();
        });
    });

    it('should handle getting share info without authentication', (done) => {
      chai.request(app)
        .get(`/api/notes/${testShareId}/share`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  // Add more test cases for other sharing-related endpoints (PUT /api/notes/:noteId/share, DELETE /api/notes/:noteId/share, etc.)

  after((done) => {
    // Clean up: Delete the test share and any other resources created during testing
    Share.deleteMany({}, (err) => {
      if (err) {
        console.error('Error cleaning up test data:', err);
      }
      done();
    });
  });
});
