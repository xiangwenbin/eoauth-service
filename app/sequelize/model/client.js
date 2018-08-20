import Sequelize from 'sequelize';
import sequelize from '../sequelize';
import { MD5 } from "jshashes";
var md5 = new MD5();
var Client = sequelize.define('Client', {
    id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    secret: {
        type: Sequelize.STRING,
        allowNull: false
    },
    grantType: {
        type: Sequelize.STRING,
        allowNull: false
    },

    clientId: {
        type: Sequelize.STRING(64),
        allowNull: false
    },
    clientName: {
        type: Sequelize.STRING(64),
        allowNull: false
    },
    scope: {
        type: Sequelize.STRING(64),
        allowNull: false
    },
    redirectUri: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    getterMethods: {
        grants: function() {
            return this.grantType.split(" ");
        },
        redirectUris: function() {
            return this.redirectUri.split(" ");
        },
        validScopes: function() {
            return this.scope.split(" ");
        }
    },
    validate: {

    },
    timestamps: false,
    freezeTableName: true,
    tableName: 'accountcenter_client'
});
export default Client;