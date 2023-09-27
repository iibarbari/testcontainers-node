FROM node:18
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN pnpm install

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "pnpm", "start" ]
