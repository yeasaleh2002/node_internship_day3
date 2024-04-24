module.exports = (sequelize, DataTypes) => {
  const Rule = sequelize.define('rules', {
    name: DataTypes.STRING,
    condition: DataTypes.TEXT,
    action: DataTypes.STRING
  });

  return Rule;
};
