#/bin/bash

nginx -g 'daemon on;'

node /generateManifest.js
node /generateMeta.js

mkdir -p /images/post
mkdir -p /images/profile
mkdir -p /images/collection
mkdir -p /images/thumb/120x120

cd /app && npm run migrate && node /app/src/server.js