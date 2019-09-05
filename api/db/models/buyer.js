'use strict';
module.exports = (sequelize, DataTypes) => {
  
  const Buyer = sequelize.define('Buyer', {
    name: DataTypes.STRING,
    lastName: DataTypes.STRING
  }, {});
  
  Buyer.associate = function () {
    // associations can be defined here
  };
  Buyer.sync().then(() => {
    console.log('Table buyer created');
  });

  return Buyer;
};