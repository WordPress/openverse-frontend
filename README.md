<img src="https://github.com/WordPress/openverse/raw/main/brand/banner.svg" width="100%"/>

<p align="center">
  <a href="https://github.com/orgs/WordPress/projects/3">Project Board</a> | <a href="https://make.wordpress.org/openverse/">Community Site</a> | <a href="https://make.wordpress.org/chat/">#openverse @ Slack</a> | <a href="https://make.wordpress.org/openverse/handbook/">Handbook</a> | <a href="https://www.figma.com/file/w60dl1XPUvSaRncv1Utmnb/Openverse-Releases">Figma Mockups</a>  | <a href="https://www.figma.com/file/GIIQ4sDbaToCfFQyKMvzr8/Openverse-Design-Library">Figma Design Library</a>
</p>

# Openverse Frontend

![openverse-frontend-ci](https://github.com/wordpress/openverse-frontend/workflows/openverse-frontend-ci/badge.svg)

This repository is the frontend UI for accessing and exploring the openly-licensed content provided by the [Openverse API](https://github.com/wordpress/openverse-api).

You can view [the application](https://wordpress.org/openverse) live on WordPress.org.

## Technology

The frontend app is built using [Vue.js](https://vuejs.org/) and [Nuxt.js](https://nuxtjs.org).

## Local Development

**Note for Windows users:** Please use [WSL](https://docs.microsoft.com/en-us/windows/wsl/install) for developing on the Openverse frontend. Several scripts, primarily support scripts, rely on a general \*nix type environment. Maintaining parity for cross platform scripts proved complicated without significant duplication. If you run into issues with running the Openverse frontend in WSL please let us know by opening an issue or [joining us on Slack](https://make.wordpress.org/chat/) in the `#openverse` room and ask for help.

We use [Volta](https://volta.sh/) to manage our local environment tools. Please install it using the instructions on their website.

Once you have volta installed, manually install `pnpm` using volta. [Volta does not currently officially support `pnpm`](https://github.com/volta-cli/volta/issues/737) so this is a stop gap solution until that support is implemented:

```bash
volta install pnpm
```

Run the following commands in order to have the code up and running on your machine:

```bash
# Builds and serves assets with hot-reload
# Automatically invokes pnpm install and pnpm i18n
pnpm dev
```

If you intend to change any text in the app, you will need to edit `src/locales/scripts/en.json5`. To ensure your changes are reflected immediately, run the following command.

```bash
# Watches the en.json5 file and updates the en.json file for every change.
pnpm i18n:watch-en
```

### Using HTTPS Locally

To enable SSL support in local development, use the `pnpm dev:secure` command. This requires you to have a private key and certificate in the root of the repository with the following names:

```shell
localhost+1-key.pem # The private key file
localhost+1.pem # The certificate file
```

The easiest way to create these files is with a local development tool called [mkcert](https://github.com/FiloSottile/mkcert). First make sure you have [mkcert installed](https://github.com/FiloSottile/mkcert#installation) and activated with `mkcert -install`. Then use `mkcert` to create a certificate for `localhost` and for the external IP address used by Nuxt's development process. That command looks like this:

```shell
mkcert localhost 192.168.50.119
```

Be sure to replace the IP address in the example with your own. See the next section for how to identify that IP address.

#### Finding your local IP address <a name = "finding-your-local-ip-address"></a>

You can find the local IP address Nuxt uses by looking at the output of `nuxt dev`. Look in your console for a box of configuration details that looks like this:

```bash
#  ╭───────────────────────────────────────────╮
#  │                                           │
#  │   Nuxt @ v2.15.8                          │
#  │                                           │
#  │   ▸ Environment: development              │
#  │   ▸ Rendering:   server-side              │
#  │   ▸ Target:      server                   │
#  │                                           │
#  │   Listening: http://192.168.50.119:8443/  │ # <-- Use this IP Address
#  │                                           │
#  ╰───────────────────────────────────────────╯
```

You will need to regenerate the certificate if this IP address changes for any reason, like by enabling a VPN or changing networks.

### Choosing which API to use

You don't need to have the Openverse API running locally to be able to run the frontend application. It's configured to communicate, by default, with the [production API](https://api.openverse.engineering) that's already publicly available. If you need to test against changes in your local API, set the `API_URL` environment variable when run the development server.

```shell
API_URL=http://localhost:8000 pnpm dev
```

### Standalone and embedded modes

The application can run in two modes. By default, it runs in embedded mode, which is loaded in an iframe on [WordPress.org/openverse](https://make.wordpress.org/openverse). It has a small header without logo and no footer.
The standalone mode which has a large header with logo and a footer, can be enabled by adding `?embedded=false` query parameter to the URL. For example, when running locally, you can go to [http://localhost:8443?embedded=false](http://localhost:8443?embedded=false) to view the standalone application.

### Running tests

Refer to the [`TESTING_GUIDELINES.md` file](./TESTING_GUIDELINES.md) for instructions on how to run tests.

### localhost tunneling

If you want to make your local development server accessible to the internet (for testing or showing someone something you're working on), you can use [`ngrok`](https://ngrok.com/). Follow the documentation on the `ngrok` site to install it and set it up. Once you have it installed, get the development server for Openverse running and in a separate window/tab, run:

```
# The extra parameters are required to ensure that ngrok redirects to the HTTPS version of the site
# and that the host header matches one that is accepted by the server
# (ngrok's default hostname is randomly generated and is not whitelisted).
ngrok http http://localhost:8443 -host-header="localhost:8443"
```

If you need to run an HTTP version (for example, if you're testing against third-party websites that do not accept the self-signed certificate generated by the dev server), run the dev server using `pnpm dev` and use the following command to start `ngrok`:

```bash
ngrok http 8443 -host-header="localhost:8443"
```

## Frontend Components

The frontend app is composed of a number of components that are documented in our [Storybook](https://wordpress.github.io/openverse-frontend).

##### How to create a component

To create a component you can run:

```
pnpm run create:component [component name in PascalCase]
for example: pnpm run create:component VButtonGreen
```

This command will create a component file, a story file for the component, a unit test file, and a regression test file. It also adds the component name to tsconfig.ts `includes` property.
Each file will have a basic template to start working with. We use [itsjonq/remake](https://www.npmjs.com/package/@itsjonq/remake?activeTab=readme) package to create files out of templates.

You can also create all those files manually or by running the following commands:

```
create a component file:
pnpm run create:component-sfc --output=[path] --name=[component name]

create a story file:
pnpm run create:story --output=[path] --name=[component name]

create a component unit test file:
pnpm run create:component-unit-test --output=[path] --name=[component name] --fileName=[component name in kebab-case]

create a component regression test file:
pnpm run create:component-storybook-test --output=[path] --name=[component name kebab-case] --fileName=[component name in kebab-case]
```

### CSS Framework

To design our components, we use the [TailwindCSS](https://tailwindcss.com/) utility-first CSS framework. We have compiled a list of TailwindCSS classes that are used in the frontend app. You can view the list [here](https://wordpress.github.io/openverse-frontend/tailwind/).

### Development Tips

If you use VS Code, you can install the [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) extension to get autocomplete for TailwindCSS classes.

## Docker and Openverse frontend

We do not currently support local development using Docker or `docker-compose`. It was supported in the past, but it was not used by the core contributors. It remained broken for many months without ever being noticed, so the assumption is that it was also not being used active community members. Local `nuxt` development is still easy across platforms, so maintaining a separate Docker development stack for the frontend did not make sense.

However, we do build and actively deploy the frontend using Docker images. If you wish to build the production image for yourself, run the following:

```shell
pnpm docker:build
```

You can also find the latest `openverse-frontend` images on our [GitHub packages page](https://github.com/WordPress/openverse-frontend/pkgs/container/openverse-frontend).

You can then run using either the locally built image or the `ghcr.io` image from the link above:

```shell
pnpm docker:run
```

The app will be available at <http://localhost:8443>.

> **Note**: If you are _not_ using HTTPS locally, do not use the URL provided by Nuxt - this will cause certificate errors because it gets rerouted to HTTPS.
> E.g. this link will not work:
>
> ```
> $ pnpm docker:run
>
> > openverse-frontend@2.2.1 start
> > nuxt start
>
> ℹ Sentry reporting is disabled ("disabled" option has been set) nuxt:sentry 18:22:32
>
>    ╭─────────────────────────────────────────╮
>    │                                         │
>    │   Nuxt @ v2.15.8                        │
>    │                                         │
>    │   ▸ Environment: production             │
>    │   ▸ Rendering:   server-side            │
>    │   ▸ Target:      server                 │
>    │                                         │
>    │   Memory usage: 48.2 MB (RSS: 152 MB)   │
>    │                                         │
>    │   Listening: http://172.17.0.2:8443/    │   <-- Won't work unless HTTPS is set up
>    │                                         │
>    ╰─────────────────────────────────────────╯
> ```

## Formatting and Linting

The code in this repository is formatted using `prettier`. If you have prettier setup in your code editor it should work out of the box; otherwise you can use the `pnpm lint:fix` script to format and fix lint errors in your code. Checks are run to lint your code and validate the formatting on git precommit using [husky](https://github.com/typicode/husky).

You will need to fix any linting issues before committing. We recommend formatting your JavaScript files on save in your text editor. You can learn how to do this in Visual Studio Code [here](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode#format-on-save).

### File name conventions

All files and folders should be written in `kebab-case`, with the exception of Vue single file components. If it ends in `.vue`, please use `PascalCase`. This distinction makes our component files stand out clearly and is [recommended by the Vue community](https://vuejs.org/v2/style-guide/#Single-file-component-filename-casing-strongly-recommended).

## Redirects <a name = "redirects"></a>

| From         | To          | Status code | Setup level            |
| ------------ | ----------- | ----------- | ---------------------- |
| /photos/\_id | /image/\_id | 301         | Nuxt server middleware |

## Just

If [`just`](https://github.com/casey/just) is your preferred command runner, you can also use `just run {script}` to run any pnpm script and `just` on its own to list the available scripts (e.g. `just run docker:build`). Our other projects use `just` as their primary script runner, so this allows parity with both the API and the catalog.

## Contributing

Pull requests are welcome! Feel free to [join us on Slack](https://make.wordpress.org/chat/) and discuss the project with the engineers and community members on #openverse.

You are welcome to take any open issue in the tracker labeled [`help wanted`](https://github.com/wordpress/openverse-frontend/labels/help%20wanted) or [`good first issue`](https://github.com/wordpress/openverse-frontend/labels/good%20first%20issue); **there's no need to ask for permission in advance**. Other issues are open for contribution as well, but may be less accessible or well defined in comparison to those that are explicitly labeled.

## Acknowledgments

Openverse, previously known as CC Search, was conceived and built at [Creative Commons](https://creativecommons.org). We thank them for their commitment to open source and openly licensed content, with particular thanks to previous team members @ryanmerkley, @janetpkr, @lizadaly, @sebworks, @pa-w, @kgodey, @annatuma, @mathemancer, @aldenstpage, @brenoferreira, and @sclachar, along with their [community of volunteers](https://opensource.creativecommons.org/community/community-team/).
