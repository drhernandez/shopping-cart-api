const sequelize = require('sequelize');

class User extends sequelize.Model {

  static init(sequelize, DataTypes) {
    return super.init(
      {
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
      },
      { sequelize }
    );
  }

  static associate() {
  }
}

module.exports = User;