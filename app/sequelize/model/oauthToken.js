import Sequelize from 'sequelize';
import sequelize from '../sequelize';
import { MD5 } from "jshashes";
var md5 = new MD5();
var OauthToken = sequelize.define('OauthToken', {
    accessToken: {
        type: Sequelize.STRING,
        allowNull: false
    },
    refreshToken: {
        type: Sequelize.STRING,
        allowNull: false
    },
    clientId: {
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
    },
    userId: {
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
    },
    accessTokenExpiresTime: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
    },
    refreshTokenExpiresTime: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
    }
}, {
    getterMethods: {
        accessTokenExpiresAt: function() {
            return new Date(this.accessTokenExpiresTime);
        },
        refreshTokenExpiresAt: function() {
            return new Date(this.refreshTokenExpiresTime);
        }
    },
    validate: {

    },
    timestamps: false,
    freezeTableName: true,
    tableName: 'accountCenter_oauthtoken'
});
export default OauthToken;