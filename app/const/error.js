const ERROR = {
    USERNAME_PASSWORD: {
        code: 411,
        msg: '帐号或密码错误'
    },
    USERNAME_NOTEXIST: {
        code: 412,
        msg: '用户名不存在'
    },
    MOBILE_NOTEXIST: {
        code: 413,
        msg: '手机号不存在'
    },
    CLIENT_IDNOTNULL: {
        code: 420,
        msg: '客户端id不能为空'
    },
    CLIENT_SECRETNOTNULL: {
        code: 421,
        msg: '客户端密钥不能为空'
    },
    CLIENT_NOTEXSIT: {
        code: 422,
        msg: '客户端不存在'
    },
    TOKEN_ACCESSTOKENNOTEXSIT: {
        code: 430,
        msg: '访问token无效'
    },
    TOKEN_REFRESHTOKENNOTEXSIT: {
        code: 431,
        msg: '刷新token无效'
    }
}
export default ERROR;