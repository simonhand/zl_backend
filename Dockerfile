FROM node:12.22.12-buster
FROM mongo:4.0.28-xenial
RUN mkdir -p /home/project
WORKDIR /home/project
EXPOSE 3000
COPY . .
CMD yarn install && yarn start