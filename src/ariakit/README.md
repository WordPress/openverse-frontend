# Ariakit vendorization

Due to [Ariakit's](https://github.com/ariakit/ariakit) current React focus, the published code pulls in the `@types/react-dom` package, which clashes with the `@vue/runtime-dom` types for "JSX" (templates). Because of this, we cannot use the published ariakit/reakit packages directly and have had to vendorize them here.

The process of adding these files was literally a copy paste job. Thanks to Ariakit's MIT license, this is safe to do. This README and the title of the directory serves as attribution for the original code.

Additionally, there are several composables in this directory which are adapted from ariakit React hooks. These are _not_ vendorized from ariakit directly but because they are essentially copied from ariakit, we've included them in this directory to consistently indicate where the original code is from.
