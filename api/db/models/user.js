'use strict';
module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define('User', { 
    name: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});

  User.associate = function () {
    // associations can be defined here
    // User.hasMany(models.Cart);
  };
  
  return User;
};