const CartsService = require('./cartsService');
const UsersService = require('./usersService');

const cartsService = new CartsService();
const usersService = new UsersService();

module.exports = {
  usersService,
  cartsService
}