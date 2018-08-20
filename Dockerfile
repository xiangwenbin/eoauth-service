# Version:0.0.1
FROM node:6
# MAINTAINER xwb0128@gmail.com deprecated
ENV NODE_ENV dev
ENV HTTP_PORT 8080

COPY . /urs/local/www/eoauth-service  
WORKDIR /urs/local/www/eoauth-service

RUN npm install babel babel-cli -g --registry=https://registry.npm.taobao.org
RUN npm install --registry=https://registry.npm.taobao.org

EXPOSE 8080
#容器启动时候启动命令
ENTRYPOINT ["node", "index.js"]
LABEL version="1.0.0" author="wbxiang@zhcpa.cn" 