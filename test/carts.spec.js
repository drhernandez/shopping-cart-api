require('dotenv').config();
const utils = require('./utils');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('..');
chai.should();
chai.use(chaiHttp);

describe('Carts', () => {

  beforeEach((done) => { //Clean the database before each test
    utils.cleanDatabase().then(() => {
      done();
    }).catch((err) => {
      console.log('Error cleaning db', err);
      done();
    })
  });

  describe('GET', () => {

    it('should fail with not found', (done) => {
      chai.request(app)
        .get('/carts/1')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message').eql('Not found');
          done();
        })
    });

    it('should get a cart', (done) => {
      utils.createTestCart().then(() => {
        chai.request(app)
          .get('/carts/1000000')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status').eql('created');
            res.body.should.have.property('buyerEmail').eql('test@test.com');
            done();
          })
      }).catch((err) => {
        console.log(err);
      })
    });
  })

  describe('POST', () => {

    it('should fail with bad request if areguments are missing', (done) => {
      chai.request(app)
        .post('/carts')
        .send({
          buyer_email: 'error@test.com'
        })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        })
    });

    it('should not create a cart if buyer does not exist', (done) => {
      chai.request(app)
      .post('/carts')
      .send({
        buyer_email: 'error@test.com',
        cart_items: [
          {
            variant_id: 1,
            quantity: 1,
          }
        ]
      })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      })
    });

    it('should not create a cart if variant does not exist', (done) => {
      utils.createTestUser().then(() => {
        chai.request(app)
          .post('/carts')
          .send({
            buyer_email: 'test@test.com',
            cart_items: [
              {
                variant_id: 1,
                quantity: 1,
              }
            ]
          })
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.have.property('causes').eql(['Variant 1 not found'])
            done();
          })
      }).catch((err) => {
        console.log(err);
        done();
      })
    });

    it('should not create a cart if variants are repeated', (done) => {
      utils.createTestUser().then(() => {
        chai.request(app)
          .post('/carts')
          .send({
            buyer_email: 'test@test.com',
            cart_items: [
              {
                variant_id: 123456789,
                quantity: 1
              },
              {
                variant_id: 123456789,
                quantity: 1
              }
            ]
          })
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property('causes').eql(['Duplicated variant ids: 123456789']);
            done();
          })
      }).catch((err) => {
        console.log(err);
        done();
      })
    });
    
    it('should create a cart', (done) => {
      utils.createTestUser().then(() => {
        chai.request(app)
          .post('/carts')
          .send({
            buyer_email: 'test@test.com',
            cart_items: [
              {
                variant_id: 123456789,
                quantity: 1
              },
              {
                variant_id: 987654321,
                quantity: 1
              }
            ]
          })
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.have.property('status').eql('created');
            done();
          })
      }).catch((err) => {
        console.log(err);
        done();
      })
    });
  });

  describe('PUT', () => {

    it('should fail with bad request if areguments are missing', (done) => {
      chai.request(app)
        .put('/carts/1')
        .send({
          buyer_email: 'error@test.com'
        })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        })
    });

    it('should fail with not found if cart does not exist', (done) => {
      chai.request(app)
        .put('/carts/1')
        .send({
          buyer_email: 'error@test.com',
          cart_items: [
            {
              variant_id: 1,
              quantity: 1,
            }
          ]
        })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('causes').eql(['cart not found'])
          done();
        })
    });

    it('should fail with not found if variant does not exist', (done) => {
      utils.createTestCart().then(() => {
        chai.request(app)
          .put('/carts/1000000')
          .send({
            buyer_email: 'test@test.com',
            cart_items: [
              {
                variant_id: 1,
                quantity: 1,
              }
            ]
          })
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.have.property('causes').eql(['Variant 1 not found'])
            done();
          })
      }).catch((err) => {
        console.log(err);
        done();
      })
    });

    it('should fail with bad request if variants are repeated', (done) => {
      utils.createTestCart().then(() => {
        chai.request(app)
          .put('/carts/1000000')
          .send({
            buyer_email: 'test@test.com',
            cart_items: [
              {
                variant_id: 123456789,
                quantity: 1
              },
              {
                variant_id: 123456789,
                quantity: 1
              }
            ]
          })
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property('causes').eql(['Duplicated variant ids: 123456789']);
            done();
          })
      }).catch((err) => {
        console.log(err);
        done();
      })
    });

    it('should update the cart', (done) => {
      utils.createTestCart().then(() => {
        chai.request(app)
          .put('/carts/1000000')
          .send({
            buyer_email: 'test@test.com',
            cart_items: [
              {
                variant_id: 123456789,
                quantity: 10
              }
            ]
          })
          .end((err, res) => {
            res.should.have.status(200);
            done();
          })
      }).catch((err) => {
        console.log(err);
        done();
      })
    });
  });

  describe('DELETE', () => {

    it('should fail with not found if cart does not exist', (done) => {
      chai.request(app)
        .delete('/carts/1')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message').eql('Could not delete cart');
          res.body.should.have.property('causes').eql(['cart not found']);
          done();
        })
    });

    it('should delete a cart', (done) => {
      utils.createTestCart().then(() => {
        chai.request(app)
          .delete('/carts/1000000')
          .end((err, res) => {
            res.should.have.status(204);
            done();
          })
      }).catch((err) => {
        console.log(err);
      })
    });
  })
})