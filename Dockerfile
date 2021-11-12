# application builder
FROM node:16 AS builder

WORKDIR /usr/app

# copy package.json and package-lock.json files
COPY package*.json .

# install dependencies including local development tools
RUN npm install

# copy the rest of the content
COPY . /usr/app

# build the application and generate a distribution package
RUN npm run build

# application package
FROM node:16 AS app

WORKDIR /usr/app

ENV NODE_ENV=production
ENV CYPRESS_INSTALL_BINARY=0

# copy the package.json and package-lock.json files
COPY package*.json .

RUN npm ci --only=production --ignore-script

# copy distribution directory with the static content
COPY --from=builder /usr/app/.nuxt /usr/app/.nuxt

# set application port
ENV PORT=8443

# expose port 8443 by default
EXPOSE 8443

# run the application in static mode
ENTRYPOINT ["npm", "start"]

