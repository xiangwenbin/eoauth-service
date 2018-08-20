import _ from 'lodash';
import UUID from 'node-uuid';
import TokenUtil from "oauth2-server/lib/utils/token-util.js";
class Util {
    

    
    static getSuccJsonResult(data){
        return {
            code:200,
            data:data
        }
    }
    
    static getErrorJsonResult(msg,code=400){
        return {
            code:code,
            msg:msg
        }
    }
    static generateUUID(){
        let args = [...arguments];
        return UUID.v4(...args);
    }

    /**
     * 获取默认请求头
     */
    static getDefaultHeads(ctx) {
        if (ctx) {
            return {
                'Cookie': ctx.get("Cookie"),
                'Authorization': ctx.get("Authorization") ||"",
            }
        } else {
            return {

            };
        }
    }

    static getJsonHeads() {
        return {
            'Content-Type': 'application/json;chaset=UTF-8'
        }
    }

    static getdefaultOptions(ctx) {
        return {
            method: 'GET',
            headers: {
                'Content-Type': 'text/plain;chaset=UTF-8'
            },
            json: true
        };
    }

    static getJsonOption() {
        return {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;chaset=UTF-8'
            },
            json: true
        };
    }

    static getFormOption() {
        return {
            method: 'POST',
            form: {

            },
            json: true
        };
    }

}
export default Util;