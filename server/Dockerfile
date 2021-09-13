FROM node:12-slim

WORKDIR /app

COPY ./server/package*.json ./ 

COPY ./server ./app

RUN npm install

COPY ./common ./app/node_modules/common

ENV PORT=5000

ENV LOCAL=TRUE

EXPOSE 5000

CMD [ "npm", "run", "docker" ]
