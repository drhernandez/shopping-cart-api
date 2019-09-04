class CartsController {
  
  getCartById(req, res) {
    res.status(200).send('get by id');
  }

  createCart(req, res) {
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