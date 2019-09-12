require('dotenv').config();
const utils = require('./utils');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
chai.should();
chai.use(chaiHttp);

describe('Checkout', () => {

  beforeEach((done) => {
    utils.cleanDatabase().then(() => {
      done();
    }).catch((err) => {
      console.log('Error cleaning db', err);
      done();
    })
  });

  describe('POST', () => {

    it('should fail with unauthorized if access_token header is missing', (done) => {
      chai.request(app)
        .post('/checkout')
        .send({
          cart_id: 1
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('message').eql('Unauthorized')
          done();
        })
    });

    it('should fail with unauthorized if access_token header is not valid', (done) => {
      chai.request(app)
        .post('/checkout')
        .set('authorization', 'test')
        .send({
          cart_id: 1
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('message').eql('Unauthorized')
          done();
        })
    });

    it('should fail with unauthorized if access_token value is not valid', (done) => {
      chai.request(app)
        .post('/checkout')
        .set('authorization', 'Bearer adsa')
        .send({
          cart_id: 1
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('message').eql('Unauthorized')
          done();
        })
    });

    it('should fail with bad reques if arguments are missing', (done) => {
      utils.createTestUser().then(() => {
        chai.request(app)
          .post('/checkout')
          .set('authorization', 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImxhc3ROYW1lIjoidGVzdCIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImlhdCI6MTU2ODE2NjM2MSwiZXhwIjoxNTY4MzM5MTYxfQ.UbdMjahsyDEsb8TuKf2fCCwQf9Acd1siy8bDwVZzAGOA3m8T4LO0kZEs7lD__H_WMm9Vc8smSDs7jzLgZR61aA')
          .send()
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property('causes').eql(['missing cart_id'])
            done();
          })
      }).catch((err) => {
        console.log(err);
      })
    });

    it('should fail with not found if cart does not exist', (done) => {
      utils.createTestUser().then(() => {
        chai.request(app)
          .post('/checkout')
          .set('authorization', 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImxhc3ROYW1lIjoidGVzdCIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImlhdCI6MTU2ODE2NjM2MSwiZXhwIjoxNTY4MzM5MTYxfQ.UbdMjahsyDEsb8TuKf2fCCwQf9Acd1siy8bDwVZzAGOA3m8T4LO0kZEs7lD__H_WMm9Vc8smSDs7jzLgZR61aA')
          .send({
            cart_id: 1
          })
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.have.property('causes').eql(['cart not found'])
            done();
          })
      }).catch((err) => {
        console.log(err);
      })
    });

    it('should fail with unauthorized if token user is not owner of the cart', (done) => {
      Promise.all([
        utils.createTestUserFromName('test2'),
        utils.createTestCart()
      ]).then(() => {
        chai.request(app)
          .post('/checkout')
          .set('authorization', 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdDIiLCJsYXN0TmFtZSI6InRlc3QyIiwiZW1haWwiOiJ0ZXN0MkB0ZXN0LmNvbSIsImlhdCI6MTU2ODE2NzQ0NSwiZXhwIjoxNTY4MzQwMjQ1fQ.WXG9pg2KlmrzhwdunM7ywiyGaas5Lj8D0JoaILq4GtQziTbfK6zHC7mZinhIXszT_ySQKxYFpqBblrG7YpLlmw')
          .send({
            cart_id: 1000000
          })
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have.property('causes').eql(['cart does not belong to access_token user'])
            done();
          })
      }).catch((err) => {
        console.log(err);
      })
    });

    it('should fail with bad request if there is not inventory', (done) => {
      Promise.all([
        utils.createTestCartWithNoInventory()
      ]).then(() => {
        chai.request(app)
          .post('/checkout')
          .set('authorization', 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImxhc3ROYW1lIjoidGVzdCIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImlhdCI6MTU2ODE2NjM2MSwiZXhwIjoxNTY4MzM5MTYxfQ.UbdMjahsyDEsb8TuKf2fCCwQf9Acd1siy8bDwVZzAGOA3m8T4LO0kZEs7lD__H_WMm9Vc8smSDs7jzLgZR61aA')
          .send({
            cart_id: 1000000
          })
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property('causes').eql(['items [123456789] are out of inventory]'])
            done();
          })
      }).catch((err) => {
        console.log(err);
      })
    });

    it('should create an order', (done) => {
      Promise.all([
        utils.createTestCart()
      ]).then(() => {
        chai.request(app)
          .post('/checkout')
          .set('authorization', 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImxhc3ROYW1lIjoidGVzdCIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImlhdCI6MTU2ODE2NjM2MSwiZXhwIjoxNTY4MzM5MTYxfQ.UbdMjahsyDEsb8TuKf2fCCwQf9Acd1siy8bDwVZzAGOA3m8T4LO0kZEs7lD__H_WMm9Vc8smSDs7jzLgZR61aA')
          .send({
            cart_id: 1000000
          })
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.have.property('shopifyOrderId').eql('1213164814398');
            res.body.should.have.property('financialStatus').eql('paid');
            done();
          })
      }).catch((err) => {
        console.log(err);
      })
    });
  });
})