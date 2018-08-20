import Sequelize from 'sequelize';
import sequelize from '../sequelize';
import { MD5 } from "jshashes";
import User from './user';
var md5 = new MD5();
var UserInfo = sequelize.define('UserInfo', {
    id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    nickname: {
        type: Sequelize.STRING,
    },
    avatar: {
        type: Sequelize.STRING
    },
    realName: {
        type: Sequelize.STRING(16)
    },
    idNumber: {
        type: Sequelize.STRING(64)
    }
}, {
    validate: {

    },
    timestamps: false,
    freezeTableName: true,
    tableName: 'accountcenter_userInfo'
});
export default UserInfo;