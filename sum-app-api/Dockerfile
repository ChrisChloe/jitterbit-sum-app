FROM node:lts-alpine
RUN mkdir -p /home/node/src/node_modules && chown -R node:node /home/node/src
WORKDIR /home/node/src
COPY package*.json ./
RUN npm install
USER node
COPY --chown=node:node . .
EXPOSE 3000
CMD [ "npm", "run", "start" ]