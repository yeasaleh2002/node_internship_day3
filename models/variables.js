module.exports = (sequelize, DataTypes) => {
  const Variable = sequelize.define('variables', {
    name: DataTypes.STRING,
    type: DataTypes.ENUM('STRING', 'FLOAT', 'INTEGER')
  });

  return Variable;
};
