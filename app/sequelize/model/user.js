import Sequelize from 'sequelize';
import sequelize from '../sequelize';
import { MD5 } from "jshashes";
var md5 = new MD5();
var User = sequelize.define('User', {
    id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        set(password) {
            this.setDataValue('password', md5.hex(password));
        }
    },
    email: {
        type: Sequelize.STRING(64),
        validate: {
            isEmail: {
                msg: "邮箱格式不对"
            }
        }
    },
    areaCode: {
        type: Sequelize.STRING(5)
    },
    mobile: {
        type: Sequelize.STRING(11)
    }
}, {
    validate: {
        neigtherNull: function() {
            if (!this.username && !this.email && !this.mobile) {
                console.log(this.username,this.email,this.mobile);
                throw new Error('数据异常')
            }
        }
    },
    timestamps: false,
    freezeTableName: true,
    tableName: 'accountcenter_user'
});
export default User;