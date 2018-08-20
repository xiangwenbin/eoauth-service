import { UserService, UserInfoService, ClientService } from '../service';
import sequelize from '../sequelize/sequelize';


class ClientFacade {

    /**
     * 通过clientId,secret  查找客户
     */
    static getClientByClientIdAndSecret(clientId, secret=null) {
        if (clientId && secret) {
            return ClientService.getClientByClientIdAndSecret(clientId, secret);
        } else if (clientId) {
            return ClientService.getClientByClientId(clientId);
        } else {
            return new Promise.resolve(null);
        }

    }
}

export default ClientFacade;