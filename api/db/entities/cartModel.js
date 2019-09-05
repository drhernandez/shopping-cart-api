const Sequelize = require('sequelize');
const Buyer = require('./buyerModel')
const CartItem = require('./cartItemModel')

// class Cart extends Sequelize.Model {
//   constructor(sequelize) {
//     super();
//     super.init({
//       id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
//       status: { type: Sequelize.STRING, allowNull: false },
//       date_created: Sequelize.DATE
//     }, {
//         sequelize: this.sequelize,
//         modelName: 'CARTS'
//       });
//     Cart.belongsTo(Buyer);
//     Cart.hasMany(CartItem);
//   }
// }
class Cart extends Sequelize.Model {}
Cart.init({
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  status: { type: Sequelize.STRING, allowNull: false },
  date_created: Sequelize.DATE
}, {
  // sequelize: db.sequelize,
  modelName: 'CARTS'
});

Cart.belongsTo(Buyer);
Cart.hasMany(CartItem);
module.exports = Cart;