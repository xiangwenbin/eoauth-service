import rp from 'request-promise';
import _ from 'lodash';
import { UserInfo } from '../sequelize/model';


/**
 * 用户信息服务
 */
class UserInfoService {

    /**
     * 创建用户信息
     */
    static createUserInfo(userInfo) {
        return UserInfo.create(userInfo, {
            fields: [
                "userId", "nickname", "avatar", "realName", "idNumber"
            ]
        });
    }

    /**
     * 通过id查找 用户
     */
    static getUserInfoById(id) {
        return UserInfo.findById(id);
    }

}

export default UserInfoService;