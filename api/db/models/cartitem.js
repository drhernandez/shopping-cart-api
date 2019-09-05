'use strict';
module.exports = (sequelize, DataTypes) => {
  
  const CartItem = sequelize.define('CartItem', {
    variant_id: { type: DataTypes.BIGINT, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false }
  }, {});
  
  CartItem.associate = function () {
    // associations can be defined here
  };

  CartItem.sync().then(() => {
    console.log('Table cartItem created');
  });
  return CartItem;
};