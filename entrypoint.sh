#/bin/bash

nginx -g 'daemon on;'

mkdir -p /content/images/post
mkdir -p /content/images/profile
mkdir -p /content/images/collection
mkdir -p /content/images/thumb/120x120


node /generateManifest.js
node /generateMeta.js
node /app/src/scripts/processImages.js

cd /app && npm run migrate && node /app/src/server.js