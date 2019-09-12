require('dotenv').config();
const utils = require('./utils');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
chai.should();
chai.use(chaiHttp);

describe('Authentication', () => {
  beforeEach((done) => { //Clean the database before each test
    utils.cleanDatabase().then(() => {
      done();
    }).catch((err) => {
      console.log('Error cleaning db', err);
      done();
    })
  });

  describe('POST', () => {

    it('should fail with bad request if there are missing parameters', (done) => {
      chai.request(app)
        .post('/authentication/login')
        .send({
          email: 'test'
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message').eql('invalid body');
          done();
        })
    });

    it('should fail with unauthorize if user does not exist', (done) => {
      chai.request(app)
        .post('/authentication/login')
        .send({
          email: 'test',
          password: 'test'
        })
        .end((err, res) => {
          res.should.have.status(401);
          done();
        })
    });

    it('should return an access_token', (done) => {
      utils.createTestUser().then(() => {
        chai.request(app)
          .post('/authentication/login')
          .send({
            email: 'test@test.com',
            password: 'test'
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('access_token');
            done();
          })
      }).catch((err) => {
        console.log(err);
      })
    });
  })
})