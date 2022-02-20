# ==
# builder
# ==

# application builder
FROM node:16 AS builder

WORKDIR /usr/app

# Install pnpm
RUN npm install -g pnpm

# copy package.json and package-lock.json files
COPY package.json .
COPY pnpm-lock.yaml .
COPY .npmrc .

# install dependencies including local development tools
RUN pnpm install --frozen-lockfile --store-dir=./pnpm-store

# copy the rest of the content
COPY . /usr/app

# disable telemetry when building the app
ENV NUXT_TELEMETRY_DISABLED=1

# build the application and generate a distribution package
RUN pnpm run build


# ==
# pre-production
# ==
# trash existing deps and install only necessary deps to reduce final image size
FROM builder AS postbuild

RUN rm -rf node_modules

ENV NODE_ENV=production

RUN pnpm install --frozen-lockfile --store-dir=./pnpm-store

# Delete everything that isn't nuxt related
RUN ls node_modules | grep -v nuxt | xargs rm -rf


# ==
# production
# ==
# application package (for production)
FROM gcr.io/distroless/nodejs-debian11:16 AS app

WORKDIR /usr/app

USER nonroot

# copy package.json and package-lock.json files
COPY package.json .
COPY pnpm-lock.yaml .
COPY .npmrc .

# copy the nuxt configuration file
COPY --from=postbuild /usr/app/nuxt.config.js .

# copy distribution directory with the static content
COPY --from=postbuild /usr/app/.nuxt /usr/app/.nuxt

# copy publically-accessible static assets
COPY --from=postbuild /usr/app/src/static /usr/app/src/static

# Copy over files needed by Nuxt's runtime process
COPY --from=postbuild /usr/app/src/locales /usr/app/src/locales
COPY --from=postbuild /usr/app/src/utils  /usr/app/src/utils
COPY --from=postbuild /usr/app/src/constants  /usr/app/src/constants
COPY --from=postbuild /usr/app/src/server-middleware  /usr/app/src/server-middleware

# Copy over dependencies
COPY --from=postbuild /usr/app/node_modules /usr/app/node_modules

# set app serving to permissive / assigned
ENV NUXT_HOST=0.0.0.0

# set app port
ENV NUXT_PORT=8443

# set application port
ENV PORT=8443

# expose port 8443 by default
EXPOSE 8443

# run the application in static mode
ENTRYPOINT ["/nodejs/bin/node", "/usr/app/node_modules/nuxt/bin/nuxt.js", "start"]
