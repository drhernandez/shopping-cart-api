const CartsController = require('./cartsController');
const UsersController = require('./usersController');
const AuthenticationController = require('./authenticationController');
const CheckoutController = require('./checkoutController');

const cartsController = new CartsController();
const usersController = new UsersController();
const authenticationController = new AuthenticationController();
const checkoutController = new CheckoutController();

module.exports = {
  usersController,
  cartsController,
  authenticationController,
  checkoutController
}