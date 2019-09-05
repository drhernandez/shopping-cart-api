'use strict';
module.exports = (sequelize, DataTypes) => {
  
  const Cart = sequelize.define('Cart', {
    status: { type: DataTypes.STRING, allowNull: false },
    date_created: DataTypes.DATE
  }, {});
  
  Cart.associate = function(models) {
    // associations can be defined here
    Cart.belongsTo(models.Buyer);
    Cart.hasMany(models.CartItem);
  };

  Cart.sync().then(() => {
    console.log('Table cart created');
  });
  
  return Cart;
};