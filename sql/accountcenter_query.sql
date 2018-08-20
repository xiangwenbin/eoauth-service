select * from AccountCenter_Client limit 10;
select * from AccountCenter_User limit 50;
select * from AccountCenter_OauthToken limit 50;
select * from AccountCenter_OauthCode limit 50;

alter TABLE AccountCenter_User ADD email VARCHAR(64)  COMMENT '邮箱';
alter TABLE AccountCenter_User ADD UNIQUE KEY UK_User_Email (email);
ALTER TABLE AccountCenter_User MODIFY mobile varchar(11) null;
ALTER TABLE AccountCenter_User MODIFY username varchar(64) null;
ALTER TABLE AccountCenter_OauthToken  DROP id;
Alter table AccountCenter_OauthToken drop primary key;
Alter table AccountCenter_OauthToken add primary key(clientId,userId);
alter TABLE AccountCenter_OauthCode ADD scope VARCHAR(64)  COMMENT '申请的权限范围';

alter TABLE AccountCenter_Client ADD clientId VARCHAR(64)  COMMENT '客户端id';
alter TABLE AccountCenter_Client ADD UNIQUE KEY UK_Client_ClientId (clientId);
ALTER TABLE AccountCenter_Client MODIFY clientId varchar(64) not null;
ALTER TABLE AccountCenter_Client MODIFY clientName varchar(64) not null;

insert into AccountCenter_Client (secret,grantType,clientName,scope,redirectUri) values('123','authorization_code','zhihui','all','http://zhihui.huitax.com');
insert into AccountCenter_User (username,password,mobile) values('xwb','123','13588042704');
insert into AccountCenter_User (username,password) values('xwb3','1234');

