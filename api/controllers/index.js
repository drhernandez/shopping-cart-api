const CartsController = require('./cartsController');
const UsersController = require('./usersController');

const cartsController = new CartsController();
const usersController = new UsersController();

module.exports = {
  usersController,
  cartsController
}