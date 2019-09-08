'use strict';
module.exports = (sequelize, DataTypes) => {
  
  const CartItem = sequelize.define('CartItem', {
    variant_id: { type: DataTypes.BIGINT, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false }
  }, {
      indexes: [{
        unique: true,
        fields: ['variant_id', 'cart_id']
      }]
  });
  
  CartItem.associate = function (models) {
    // associations can be defined here
    CartItem.belongsTo(models.Cart);
  };

  return CartItem;
};