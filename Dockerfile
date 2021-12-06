FROM node:12-slim
USER root
RUN mkdir -p /app/node_modules && chown -R node:node /app
WORKDIR /app
COPY [ "server/package.json", "server/package-lock.json", "server/tsconfig.json","./"]
RUN npm install
RUN npm install -g typescript
RUN npm install -g ts-node
COPY . .
COPY --chown=node:node . .
CMD ["npm run dev"]
