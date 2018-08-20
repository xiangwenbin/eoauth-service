import Sequelize from 'sequelize';
import sequelize from '../sequelize';
import { MD5 } from "jshashes";
var md5 = new MD5();
var OauthCode = sequelize.define('OauthCode', {
    id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    code: {
        type: Sequelize.STRING,
        allowNull: false
    },
    scope:{
        type: Sequelize.STRING
    },
    clientId: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
    },
    userId: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
    },
    expiresTime: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
    }
}, {
    
    getterMethods: {
        expiresAt: function() {
            return new Date(this.expiresTime);
        },
        authorizationCode:function() {
            return this.code;
        }
    },
    validate: {

    },
    timestamps: false,
    freezeTableName: true,
    tableName: 'accountcenter_oauthcode'
});
export default OauthCode;