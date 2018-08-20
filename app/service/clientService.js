import rp from 'request-promise';
import _ from 'lodash';
import { Client } from '../sequelize/model';


/**
 * 客户服务
 */
class ClientService {

    /**
     * 创建客户
     */
    static createClient(client) {
        return Client.create(client, {}, {

        });
    }

    /**
     * 通过id 查找 客户
     */
    static getClientById(id) {
        return Client.findById(id, {});
    }

    /**
     * 通过clientId,secret  查找客户
     */
    static getClientByClientIdAndSecret(clientId, secret) {
        return Client.findOne({
            where: {
                clientId: clientId,
                secret: secret
            }
        });
    }

    /**
     * 通过clientId  查找客户
     */
    static getClientByClientId(clientId) {
        return Client.findOne({
            where: {
                clientId: clientId
            }
        });
    }
}

export default ClientService;