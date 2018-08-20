cd `dirname $0`
pm2 stop -s oauth-service
pm2 delete -s oauth-service
pm2 start -n oauth-service test.js
