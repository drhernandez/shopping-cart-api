const Sequelize = require('sequelize');

// class Buyer extends Sequelize.Model {
//   constructor(sequelize) {
//     super();
//     super.init({
//       id: { type: Sequelize.BIGINT, primaryKey: true }
//     }, {
//         sequelize: sequelize,
//         modelName: 'BUYERS'
//     });
//   }
// }

class Buyer extends Sequelize.Model { }
Buyer.init({
  id: { type: Sequelize.BIGINT, primaryKey: true }
}, {
  // sequelize: db.sequelize,
  modelName: 'BUYERS'
});

module.exports = Buyer;