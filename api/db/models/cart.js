const sequelize = require('sequelize');

class Cart extends sequelize.Model {

  static init(sequelize, DataTypes) {
    return super.init(
      {
        status: { type: DataTypes.STRING, allowNull: false }
      },
      { sequelize }
    );
  }

  static associate(models) {
    this.hasMany(models.CartItem, { as: 'cartItems', onDelete: 'cascade', onUpdate: 'cascade' });
    this.belongsTo(models.Order);
    this.belongsTo(models.User, { as: 'buyer' });
  }
}

module.exports = Cart;