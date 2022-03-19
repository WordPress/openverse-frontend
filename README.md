<img src="https://github.com/WordPress/openverse/raw/main/brand/banner.svg" width="100%"/>

<p align="center">
  <a href="https://github.com/orgs/WordPress/projects/3">Project Board</a> | <a href="https://make.wordpress.org/openverse/">Community Site</a> | <a href="https://make.wordpress.org/chat/">#openverse @ Slack</a> | <a href="https://make.wordpress.org/openverse/handbook/openverse-handbook/">Handbook</a> | <a href="https://www.figma.com/file/w60dl1XPUvSaRncv1Utmnb/Openverse-Releases">Figma Mockups</a>  | <a href="https://www.figma.com/file/GIIQ4sDbaToCfFQyKMvzr8/Openverse-Design-Library">Figma Design Library</a>
</p>

# Openverse Frontend

![openverse-frontend-ci](https://github.com/wordpress/openverse-frontend/workflows/openverse-frontend-ci/badge.svg)

This repository is the frontend UI for accessing and exploring the openly-licensed content provided by the [Openverse API](https://github.com/wordpress/openverse-api).

You can view [the application](https://wordpress.org/openverse) live on WordPress.org. You can also view [the production Storybook](https://wordpress.github.io/openverse-frontend)

## Technology

The frontend app is built using [Vue.js](https://vuejs.org/) and [Nuxt.js](https://nuxtjs.org).

## Local Development

We use [Volta](https://volta.sh/) to manage our local environment tools. Please install it using the instructions on their website.

Once you have volta installed, manually install `pnpm` using volta. [Volta does not currently officially support `pnpm`](https://github.com/volta-cli/volta/issues/737) so this is a stop gap solution until that support is implemented:

```bash
volta install pnpm
```

Run the following commands in order to have the code up and running on your machine:

```bash
# installs dependencies
pnpm install

# sets up required i18n files
pnpm i18n:get-translations

# Builds and serves assets with hot-reload
pnpm dev

```

### Using HTTPS Locally

To enable SSL support in loval development, use the `pnpm dev:secure` command. This requires you to have a private key and certificate in the root of the repository with the following names:

```shell
localhost+1-key.pem # The private key file
localhost+1.pem # The certificate file
```

The easiest way to create these files is with a local development tool called [mkcrt](https://github.com/FiloSottile/mkcert). After [installing mkcert](https://github.com/FiloSottile/mkcert#installation) and activating it with `mkcert -install`, run the following command in the root of the reppository:

```bash
# Use `mkcert` to create a certificate for `localhost` and for the external IP address used by nuxt.
# You may need to regenerate the certificate if this IP address changes for any reason.
#
# You can find the IP by looking at the output of `nuxt dev`. For example:
#  ╭────────────────────────────────────────────╮
#  │                                           │
#  │   Nuxt @ v2.15.8                          │
#  │                                           │
#  │   ▸ Environment: development              │
#  │   ▸ Rendering:   server-side              │
#  │   ▸ Target:      server                   │
#  │                                           │
#  │   Listening: http://192.168.50.119:8443/  │ # <-- Use this IP Address
#  │                                           │
#  ╰────────────────────────────────────────────╯

mkcert localhost 192.168.50.119
```

### Docker setup

Alternatively, you can use Docker to build and run the application. You just have to run:

```bash
docker-compose up
```

You should now have the application running and accessible at http://localhost:8443.

You don't need to have the Openverse API running locally to be able to run the frontend application. It's configured to communicate, by default, with the [API](https://api.openverse.engineering) that's already publicly available. If you wish, you can change the URL of the API that's used during development by setting the `API_URL` environment variable.

### Standalone and embedded modes

The application can run in two modes. By default, it runs in embedded mode, which is loaded in an iframe on [WordPress.org/openverse](https://make.wordpress.org/openverse). It has a small header without logo and no footer.
The standalone mode which has a large header with logo and a footer, can be enabled by adding `?embedded=false` query parameter to the URL. For example, when running locally, you can go to [http://localhost:8443?embedded=false](http://localhost:8443?embedded=false) to view the standalone application.

### Running tests

You can run the unit tests by executing:

```bash
pnpm test
```

To run the e2e tests, run:

```bash
pnpm test:e2e
```

You might have to run `npx playwright install` to get the browsers installed if e2e tests fail.

When writing e2e tests, you can also use `pnpm generate-e2e-tests` to generate tests and test selectors.

### localhost tunneling

If you want to make your local development server accessible to the internet (for testing or showing someone something you're working on), you can use [`ngrok`](https://ngrok.com/). Follow the documentation on the `ngrok` site to install it and set it up. Once you have it installed, get the development server for Openverse running and in a separate window/tab, run:

```
# The extra parameters are required to ensure that ngrok redirects to the HTTPS version of the site
# and that the host header matches one that is accepted by the server
# (ngrok's default hostname is randomly generated and is not whitelisted).
ngrok http http://localhost:8443 -host-header="localhost:8443"
```

If you need to run an HTTP version (for example, if you're testing against third-party websites that do not accept the self-signed certificate generated by the dev server), run the dev server using `pnpm dev` and use the following command to start `ngrok`:

```
ngrok http 8443 -host-header="localhost:8443"
```

## Formatting and Linting

The code in this repository is formatted using `prettier`. If you have prettier setup in your code editor it should work out of the box; otherwise you can use the `pnpm lintfix` script to format and fix lint errors in your code. Checks are run to lint your code and validate the formatting on git precommit using [husky](https://github.com/typicode/husky).

You will need to fix any linting issues before committing. We recommend formatting your JavaScript files on save in your text editor. You can learn how to do this in Visual Studio Code [here](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode#format-on-save).

### File name conventions

All files and folders should be written in `kebab-case`, with the exception of Vue single file components. If it ends in `.vue`, please use `PascalCase`. This distinction makes our component files stand out clearly and is [recommended by the Vue community](https://vuejs.org/v2/style-guide/#Single-file-component-filename-casing-strongly-recommended).

## Redirects

| From         | To          | Status code | Setup level            |
| ------------ | ----------- | ----------- | ---------------------- |
| /photos/\_id | /image/\_id | 301         | Nuxt server middleware |

## Contributing

Pull requests are welcome! Feel free to [join us on Slack](https://make.wordpress.org/chat/) and discuss the project with the engineers and community members on #openverse.

You are welcome to take any open issue in the tracker labeled [`help wanted`](https://github.com/wordpress/openverse-frontend/labels/help%20wanted) or [`good first issue`](https://github.com/wordpress/openverse-frontend/labels/good%20first%20issue); **there's no need to ask for permission in advance**. Other issues are open for contribution as well, but may be less accessible or well defined in comparison to those that are explicitly labeled.

## Acknowledgments

Openverse, previously known as CC Search, was conceived and built at [Creative Commons](https://creativecommons.org). We thank them for their commitment to open source and openly licensed content, with particular thanks to previous team members @ryanmerkley, @janetpkr, @lizadaly, @sebworks, @pa-w, @kgodey, @annatuma, @mathemancer, @aldenstpage, @brenoferreira, and @sclachar, along with their [community of volunteers](https://opensource.creativecommons.org/community/community-team/).
