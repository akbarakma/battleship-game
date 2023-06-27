FROM node:12
RUN apt update && apt install nginx -y
WORKDIR /battleship-app
COPY package.json ./
RUN npm install
COPY ./ ./
EXPOSE 4000
CMD npm run start