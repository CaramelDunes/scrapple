FROM node:14-alpine AS builder

WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install

COPY ./src ./src
COPY ./static ./static
COPY ./rollup.config.js ./
COPY ./tsconfig.json ./

RUN npm run build

FROM node:14-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install

COPY --from=builder /usr/src/app/__sapper__ ./__sapper__
COPY --from=builder /usr/src/app/static ./static

EXPOSE 3000

ENV HOST=0.0.0.0

CMD ["npm", "start"]