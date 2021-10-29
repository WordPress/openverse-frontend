# application builder
FROM node:16-alpine AS builder

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
FROM node:16-alpine AS app

WORKDIR /usr/app

ENV NODE_ENV=production
ENV CYPRESS_INSTALL_BINARY=0

# copy the package.json and package-lock.json files
COPY package*.json .

RUN npm install

# copy distribution directory with the static content
COPY --from=builder /usr/app/dist /usr/app/dist


# expose port 3000 by default
# https://nuxtjs.org/docs/features/configuration/#edit-host-and-port
EXPOSE 3000

# run the application in static mode
CMD ["npm", "start"]

