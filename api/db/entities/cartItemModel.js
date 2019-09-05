const Sequelize = require('sequelize');

// class CartItem extends Sequelize.Model {
//   constructor(sequelize) {
//     super();
//     super.init({
//       id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
//       variantid: { type: Sequelize.BIGINT, allowNull: false },
//       quantity: { type: Sequelize.INTEGER, allowNull: false }
//     }, {
//         sequelize: sequelize,
//         modelName: 'CART_ITEMS'
//     });
//   }
// }

class CartItem extends Sequelize.Model { }
CartItem.init({
  id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
  variantid: { type: Sequelize.BIGINT, allowNull: false },
  quantity: { type: Sequelize.INTEGER, allowNull: false }
}, {
  // sequelize: db.sequelize,
  modelName: 'CART_ITEMS'
});

module.exports = CartItem;