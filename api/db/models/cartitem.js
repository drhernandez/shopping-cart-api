'use strict';
module.exports = (sequelize, DataTypes) => {
  
  const CartItem = sequelize.define('CartItem', {
    variant_id: { type: DataTypes.BIGINT, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false }
  }, {});
  
  CartItem.associate = function (models) {
    // associations can be defined here
    CartItem.belongsTo(models.Cart);
  };

  return CartItem;
};