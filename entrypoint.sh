#/bin/bash

nginx -g 'daemon on;'

node /generateManifest.js
node /generateMeta.js
cd /app && npm run migrate && node /app/src/server.js