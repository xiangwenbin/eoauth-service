import rp from 'request-promise';
import _ from 'lodash';
import { User } from '../sequelize/model';


/**
 * 用户服务
 */
class UserService {

    /**
     * 创建用户
     */
    static createUser(user) {
        return User.create(user, {
            fields: [
                "username", "password", "email", "mobile", "areaCode"
            ],
            attributes: { exclude: ['password'] }
        }, {

        });
    }

    /**
     * 通过id查找 用户
     */
    static getUserById(id) {
        return User.findById(id, {
            attributes: { exclude: ['password'] }
        });
    }


    /**
     * 通过用户名，密码查找用户
     */
    static getUserByUserNameAndPassword({ username, password }) {
        let user = User.build({ username, password }).get({ plain: true })
        return User.findOne({
            where: {
                username: user.username,
                password: user.password
            }
        });
    }

    /**
     * 通过email，密码查找用户
     */
    static getUserByEmailAndPassword({ email, password }) {
        let user = User.build({ email, password }).get({ plain: true })
        return User.findOne({
            where: {
                email: user.email,
                password: user.password
            }
        });
    }

    /**
     * 通过mobile，密码查找用户
     */
    static getUserByMobileAndPassword({ mobile, password }) {
        let user = User.build({ mobile, password }).get({ plain: true })
        return User.findOne({
            where: {
                mobile: user.mobile,
                password: user.password
            }
        });
    }

    /**
     * 通过mobile查找用户
     */
    static getUserByMobile(mobile) {
        // let user=User.build({mobile}).get({plain: true})
        return User.findOne({
            where: {
                mobile: mobile
            },
            attributes: { exclude: ['password'] }
        });
    }

    /**
     * 通过username查找用户
     */
    static getUserByUsername(username) {
        // let user=User.build({mobile}).get({plain: true})
        return User.findOne({
            where: {
                username: username
            }
        });
    }

    /**
     * 通过email查找用户
     */
    static getUserByEmail(email) {
        // let user=User.build({mobile}).get({plain: true})
        return User.findOne({
            where: {
                email: email
            }
        });
    }

    /**
     *
     */
    // static getUser(username, mobile, email) {
    //     // let user=User.build({mobile}).get({plain: true})
    //     return User.findOne({
    //         $or: [
    //             { username: username },
    //             { mobile: mobile },
    //             { email: email }
    //         ]
    //     });
    // }


    /**
     * 通过id 修改用户
     */
    static updateUserById(user) {
        return User.update(user, {
            where: {
                id: user.id
            },
            fields: [
                "username", "email", "mobile", "areaCode"
            ]
        });
    }

    /**
     * 修改密码
     */
    static updatePassword(user) {
        return User.update(user, {
            where: {
                id: user.id
            },
            validate: false,
            fields: [
                "password"
            ]
        });
    }
}

export default UserService;