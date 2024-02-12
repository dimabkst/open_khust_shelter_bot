FROM --platform=linux/amd64 node:20-alpine

# update packages
RUN apk update

# create root application folder
WORKDIR /app

# copy configs to /app folder
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma

RUN apk add --no-cache openssl

RUN npm ci

RUN npx prisma generate

COPY . ./

RUN npm run build

RUN npm run copy

# run different scripts depending on NODE_ENV
CMD npm run "$(if [ "$NODE_ENV" = "development" ] ; then echo "dev" ; else echo "start" ; fi)"
