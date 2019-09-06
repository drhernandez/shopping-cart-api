const CartsService = require('./cartsService');
const UsersService = require('./usersService');

const cartsService = new CartsService();

module.exports = {
  UsersService,
  cartsService
}