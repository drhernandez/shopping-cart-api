require('dotenv').config();
const utils = require('./utils');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
chai.should();
chai.use(chaiHttp);

describe('Users', () => {
  beforeEach((done) => { //Clean the database before each test
    utils.cleanDatabase().then(() => {
      done();
    }).catch((err) => {
      console.log('Error cleaning db', err);
      done();
    })
  });

  describe('GET', () => {

    it('should fail with not found if user does not exist', (done) => {
      chai.request(app)
        .get('/users/test@test.com')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message').eql('Not found');
          done();
        })
    });

    it('should get a user', (done) => {
      utils.createTestUser().then(() => {
        chai.request(app)
          .get('/users/test@test.com')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('name').eql('test');
            res.body.should.have.property('lastName').eql('test');
            res.body.should.have.property('email').eql('test@test.com');
            done();
          })
      }).catch((err) => {
        console.log(err);
      })
    });
  })

  describe('POST', () => {

    it('should return bad request if an attribute is missing', (done) => {
      chai.request(app)
        .post('/users')
        .send({
          name: 'test',
          last_name: 'test'
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message').eql('invalid body');
          done();
        })
    });

    it('should fail with bad request if user email already exist', (done) => {
      utils.createTestUser().then(() => {
        chai.request(app)
          .post('/users')
          .send({
            name: 'test2',
            last_name: 'test2',
            email: 'test@test.com',
            password: 'test2'
          })
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property('causes').eql(['email already exist']);
            done();
          })
      }).catch((err) => {
        console.log(err);
      })
    });

    it('should create a user', (done) => {
      chai.request(app)
        .post('/users')
        .send({
          name: 'test',
          last_name: 'test',
          email: 'test@test.com',
          password: 'test'
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('name').eql('test');
          res.body.should.not.have.property('password');
          done();
        })
    });
  })
})