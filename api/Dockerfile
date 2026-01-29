ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine3.22 AS build

WORKDIR /app

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --only=production

COPY ./api ./

FROM node:${NODE_VERSION}-alpine3.22 AS prod

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app ./

EXPOSE 5000
CMD [ "node", "index.js" ]
