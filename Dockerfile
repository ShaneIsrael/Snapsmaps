# build environment
FROM node:20.12-alpine3.18 as build
WORKDIR .

ENV PATH node_modules/.bin:$PATH
COPY client/package.json ./
COPY client/package-lock.json ./
COPY client/public ./
RUN npm i -g --silent npm@9.1.3
RUN npm i --silent
COPY client/ ./
RUN npm run build

# production environment
FROM node:20.12-alpine3.18
RUN apk add --update nginx bash
RUN mkdir /var/cache/nginx
COPY --from=build /build /app/build
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY entrypoint.sh /
COPY generateMeta.js /
COPY generateManifest.js /
COPY manifest.template.json /

# Copy Assets
COPY assets/logo_with_wordmark.png /content/images/assets
COPY assets/logo_with_wordmark.svg /content/images/assets

# Create app directory
WORKDIR /app

# Install app dependencies
COPY server/package*.json ./
RUN npm ci --omit=dev
RUN npm install -g sequelize-cli

# Move source
COPY server/src ./src
COPY server/.sequelizerc .


EXPOSE 80
ENV NODE_ENV=production

WORKDIR /
CMD ["bash", "/entrypoint.sh"]
