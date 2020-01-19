module.exports = (sequelize, DataTypes) => {
  const RevokedToken = sequelize.define("revoked_token", {
    jti: {
      type: DataTypes.STRING
    }
  });

  return RevokedToken;
};
