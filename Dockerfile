FROM node:12-alpine

WORKDIR /opt/app

ENV PORT=80

RUN echo 'crond' > /boot.sh

COPY package*.json ./

RUN npm install --production

COPY . .
RUN npm run build
CMD sh /boot.sh && npm start