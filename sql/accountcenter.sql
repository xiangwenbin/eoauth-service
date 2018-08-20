
CREATE TABLE AccountCenter_User (
	id BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT COMMENT 'id' ,
	username VARCHAR(64)   COMMENT '用户名',
	password VARCHAR(256)  NOT NULL COMMENT 'MD5密码',
    email VARCHAR(64)  COMMENT '邮箱',
    areaCode VARCHAR(5)  NOT NULL DEFAULT '+86' COMMENT '手机国际区号',
	mobile VARCHAR(11)  NOT NULL COMMENT '手机号',
	PRIMARY KEY  (id),
    UNIQUE KEY UK_User_Username (username),
    UNIQUE KEY UK_User_Mobile (mobile),
    UNIQUE KEY UK_User_Email (email)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8 COMMENT='用戶登录信息';
CREATE TABLE AccountCenter_UserInfo (
	id BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT COMMENT 'id',
    userId BIGINT UNSIGNED  NOT NULL COMMENT 'Userid' ,
	nickname VARCHAR(64) COMMENT '昵称',
	avatar VARCHAR(256) COMMENT '头像',
    realName VARCHAR(16) COMMENT '真实姓名',
    idNumber VARCHAR(64) COMMENT '身份证号',
	PRIMARY KEY  (id),
    UNIQUE KEY UK_UserInfo_UserId (userId)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8 COMMENT='用戶基础信息表';
CREATE TABLE AccountCenter_Client (
	id BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT COMMENT 'id',
    secret VARCHAR(256) NOT NULL COMMENT '密钥',
	grantType VARCHAR(256) NOT NULL DEFAULT 'authorization_code refresh_token' COMMENT '授权类型',
    clientId VARCHAR(64) NOT NULL COMMENT '客户端id',
	clientName VARCHAR(64) NOT NULL COMMENT '客户端名',
    scope VARCHAR(64) NOT NULL DEFAULT 'all' COMMENT '申请的权限范围',
    redirectUri VARCHAR(256) NOT NULL  COMMENT '客户端重定向url',
	PRIMARY KEY  (id),
    UNIQUE KEY UK_Client_ClientId (clientId),
    UNIQUE KEY UK_Client_ClientName (clientName)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8 COMMENT='客户端信息';
#drop table AccountCenter_OauthCode;
CREATE TABLE AccountCenter_OauthCode (
	id BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT COMMENT 'id',
    code VARCHAR(256) NOT NULL COMMENT '授权码',
	clientId BIGINT UNSIGNED NOT NULL  COMMENT '客户端id',
	userId BIGINT UNSIGNED NOT NULL  COMMENT '用户id',
    expiresTime BIGINT UNSIGNED  NOT NULL COMMENT '过期时间',
    scope VARCHAR(64)  COMMENT '申请的权限范围',
	PRIMARY KEY  (id),
    UNIQUE KEY UK_OauthCode_Code (code)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8 COMMENT='授权码';
CREATE TABLE AccountCenter_OauthToken (
    accessToken VARCHAR(256) NOT NULL COMMENT '访问token',
    refreshToken VARCHAR(256) NOT NULL COMMENT '刷新token',
	clientId BIGINT UNSIGNED NOT NULL  COMMENT '客户端id',
	userId BIGINT UNSIGNED NOT NULL  COMMENT '用户id',
    accessTokenExpiresTime BIGINT UNSIGNED  NOT NULL COMMENT '访问token过期时间',
    refreshTokenExpiresTime BIGINT UNSIGNED  NOT NULL COMMENT '刷新token过期时间',
	PRIMARY KEY  (clientId,userId)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8 COMMENT='Token值';


