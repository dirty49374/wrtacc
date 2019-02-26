FROM node:10.12.0 AS builder

WORKDIR /app

COPY package.json .
RUN npm install
COPY src/ ./src
COPY views/ ./views



FROM node:10.12.0

WORKDIR /app
COPY --from=builder /app /app
CMD [ "node", "src/index.js" ]

