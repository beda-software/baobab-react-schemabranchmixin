# Inherit from Heroku's stack
FROM heroku/cedar:14
ENV PORT 8000
ENV NODE_ENGINE 4.1.1
ENV PATH /app/heroku/node/bin/:/app/node_modules/.bin:$PATH
RUN mkdir -p /app/heroku/node /app/.profile.d
WORKDIR /app/user
RUN curl -s https://s3pository.heroku.com/node/v$NODE_ENGINE/node-v$NODE_ENGINE-linux-x64.tar.gz | tar --strip-components=1 -xz -C /app/heroku/node
RUN echo "export PATH=\"/app/heroku/node/bin:/app/user/node_modules/.bin:\$PATH\"" > /app/.profile.d/nodejs.sh

#It can be replaced by inheriting from node:4.1.1 for non-heroku docker deploy
#FROM node:4.1.1

WORKDIR /app
RUN npm install -g webpack
RUN npm install -g karma-cli
ADD package.json ./package.json
RUN npm i
ADD . /app/user/
WORKDIR /app/user/
RUN npm run production-build
