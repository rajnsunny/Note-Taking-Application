const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const Note = require('../app/models/note'); // Assuming the model is defined in Note.js

chai.use(chaiHttp);
const expect = chai.expect;

describe('Notes Controller Tests', () => {
  let authToken; // To store the JWT token for authenticated requests
  let testNoteId; // To store the ID of the test note created

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

  describe('POST /api/notes', () => {
    it('should create a new note for the authenticated user', (done) => {
      chai.request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test Note', content: 'This is a test note.' })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('note');
          testNoteId = res.body.note._id; // Save ID for subsequent tests
          done();
        });
    });

    it('should handle creating a note without authentication', (done) => {
      chai.request(app)
        .post('/api/notes')
        .send({ title: 'Unauthorized Note', content: 'This note should not be created.' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('GET /api/notes', () => {
    it('should get a list of all notes for the authenticated user', (done) => {
      chai.request(app)
        .get('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('notes');
          expect(res.body.notes).to.be.an('array');
          done();
        });
    });

    it('should handle getting notes without authentication', (done) => {
      chai.request(app)
        .get('/api/notes')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  // Add more test cases for other note-related endpoints (GET /api/notes/:noteId, PUT /api/notes/:noteId, DELETE /api/notes/:noteId, etc.)

  describe('DELETE /api/notes/:noteId', () => {
    it('should delete a note by ID for the authenticated user', (done) => {
      chai.request(app)
        .delete(`/api/notes/${testNoteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message');
          done();
        });
    });

    it('should handle deleting a note without authentication', (done) => {
      chai.request(app)
        .delete(`/api/notes/${testNoteId}`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  // Add more test cases for other note-related endpoints

  after((done) => {
    // Clean up: Delete the test user and any other resources created during testing
    Note.deleteMany({}, (err) => {
      if (err) {
        console.error('Error cleaning up test data:', err);
      }
      done();
    });
  });
});
