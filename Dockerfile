FROM node:18
RUN corepack enable
RUN corepack prepare pnpm@7.18.0 --activate

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN pnpm install

# Bundle app source
COPY . .
#COPY ./config ./config
#COPY ./models ./models
#COPY ./routes ./routes
#COPY ./services ./services
#COPY ./.env ./.env
#COPY ./index.ts ./index.ts
#COPY ./tsconfig.json ./tsconfig.json
#COPY ./Dockerfile ./Dockerfile
#COPY ./docker-compose.yml ./docker-compose.yml

RUN pnpm run build

COPY .env ./dist/.env
WORKDIR ./dist

EXPOSE 3000
CMD [ "pnpm", "dev" ]
