#/bin/bash

nginx -g 'daemon on;'

cd /app

npm run migrate && node /app/src/server.js