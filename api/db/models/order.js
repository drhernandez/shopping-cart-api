const sequelize = require('sequelize');

class Order extends sequelize.Model {

  static init(sequelize, DataTypes) {
    return super.init(
      {
        shopifyOrderId: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        financialStatus: { 
          type: DataTypes.STRING, 
          allowNull: false 
        },
        totalPrice: {
          type: DataTypes.DOUBLE,
          allowNull: false
        }
      },
      { sequelize }
    );
  }

  static associate() {
  }
}

module.exports = Order;