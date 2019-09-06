const { cartsService } = require('../services');

class CartsController {
  
  getCartById(req, res) {
    res.status(200).send('get by id');
  }

  createCart(req, res) {

    const cart = req.body;
    //validateCart()
    cartsService.createCart(cart);
    res.status(201).send('created');
  }

  updateCart(req, res) {
    res.status(200).send('updated');
  }

  deleteCart(req, res) {
    res.status(204).end();
  }
}

module.exports = CartsController;