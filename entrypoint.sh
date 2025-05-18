#/bin/bash

nginx -g 'daemon on;'

mkdir -p /content/images/post
mkdir -p /content/images/profile
mkdir -p /content/images/collection
mkdir -p /content/images/thumb/120x120


node /generateManifest.js
node /generateMeta.js

cd /app && npm run migrate 
cd /app && node --import=extensionless/register src/scripts/processImages.js
node --import=extensionless/register /app/src/server.js