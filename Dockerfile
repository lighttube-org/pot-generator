FROM node:18.20.4-alpine3.20
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY package.json package-lock.json index.js LICENSE .
RUN npm install
EXPOSE 3000
CMD [ "node", "index.js" ]
