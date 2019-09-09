const sequelize = require('sequelize');

class CartItem extends sequelize.Model {

  static init(sequelize, DataTypes) {
    return super.init(
      {
        variant_id: { type: DataTypes.BIGINT, allowNull: false },
        quantity: { type: DataTypes.INTEGER, allowNull: false }
      },
      { sequelize }
    );
  }

  static associate(models) {
    this.belongsTo(models.Cart);
  }
}

module.exports = CartItem;