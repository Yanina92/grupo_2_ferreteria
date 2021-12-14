module.exports = (sequelize, dataTypes) => {
  let alias = 'User';
  let cols = {
      id: {
          type: dataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
      },
      first_name: {
          type: dataTypes.STRING(255)
      },
      last_name: {
          type: dataTypes.STRING(255)
      },
      email:{
          type: dataTypes.STRING(255)
      },
      password: {
          type: dataTypes.STRING(255)
      },
      phone: {
          type: dataTypes.STRING(255)
      },
      image: {
          type: dataTypes.STRING(255)
      },
      admin: {
        type: dataTypes.BOOLEAN,
        defaultValue: 0
    }
  };
  let config = {
      tableName: 'User',
      timestamps: false
  };
  const User = sequelize.define(alias, cols, config);

  User.associate = (models) => {
      User.belongsToMany(models.Products,{
          as: "products",
          through: "products_users",
          foreignKey: "product_id",
          otherKey: "user_id",
          timestamps: false
      });
  }

  return User
}

