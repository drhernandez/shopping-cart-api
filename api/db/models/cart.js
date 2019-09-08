'use strict';
module.exports = (sequelize, DataTypes) => {
  
  const Cart = sequelize.define('Cart', {
    status: { type: DataTypes.STRING, allowNull: false }
  }, {});
  
  Cart.associate = function(models) {
    // associations can be defined here
    Cart.hasMany(models.CartItem);
    Cart.belongsTo(models.User, { as: 'buyer' });
  };

  return Cart;
};