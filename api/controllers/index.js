const CartsController = require('./cartsController');
const UsersController = require('./usersController');
const AuthenticationController = require('./authenticationController');

const cartsController = new CartsController();
const usersController = new UsersController();
const authenticationController = new AuthenticationController();

module.exports = {
  usersController,
  cartsController,
  authenticationController
}