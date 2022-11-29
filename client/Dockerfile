FROM node:17-alpine
WORKDIR /usr/src/client

COPY ./client .

RUN npm install

CMD ["npm", "start"]

EXPOSE 3000