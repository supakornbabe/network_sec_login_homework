FROM node:10

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install --only=production

COPY . .

EXPOSE 9092

CMD ["npm","start"]
