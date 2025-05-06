# recma-mdx-escape-missing-components

[![npm version][badge-npm-version]][url-npm-package]
[![npm downloads][badge-npm-download]][url-npm-package]
[![publish to npm][badge-publish-to-npm]][url-publish-github-actions]
[![code-coverage][badge-codecov]][url-codecov]
[![type-coverage][badge-type-coverage]][url-github-package]
[![typescript][badge-typescript]][url-typescript]
[![license][badge-license]][url-license]

This package is a **[unified][unified]** (**[recma][recma]**) plugin **which allows you to escape MDX components that are either missing or not provided in an MDX document.**

**[unified][unified]** is a project that transforms content with abstract syntax trees (ASTs) using the new parser **[micromark][micromark]**. **[recma][recma]** adds support for producing a javascript code by transforming **[esast][esast]** which stands for Ecma Script Abstract Syntax Tree (AST) that is used in production of compiled source for the **[MDX][MDX]**.

## When should I use this?

**This plugin is useful for escaping MDX components that are missing or not explicitly provided in your MDX document.** 

You won’t encounter errors for missing or undefined MDX components because `recma-mdx-escape-missing-components` assigns a default value of **`() => null`** for them.

## Installation

This package is suitable for ESM only. In Node.js (version 18+), install with npm:

```bash
npm install recma-mdx-escape-missing-components
```

or

```bash
yarn add recma-mdx-escape-missing-components
```

## Usage

Say we have the following file, `example.mdx`, which consists some mdx components.

```mdx
# Hi

<Component1 />

<Component2 />
```

And our module, `example.js`, looks as follows:

```javascript
import { read } from "to-vfile";
import { compile } from "@mdx-js/mdx";
import recmaMdxEscapeMissingComponents from "recma-mdx-escape-missing-components";

main();

async function main() {
  const source = await read("example.mdx");

  const compiledSource = await compile(source, {
    recmaPlugins: [recmaMdxEscapeMissingComponents],
  });

  return String(compiledSource);
}
```

Now, running `node example.js` produces the `compiled source` which contains the statement below:

```js
// ...
const _EmptyComponent = () => null;
function _createMdxContent(props) {
  // ...
  const {Component1 = _EmptyComponent, Component2 = _EmptyComponent} = _components;
  // ...
}
```

Without the `recma-mdx-escape-missing-components`, you’d not get any Empty Component definition and default value for the components:

```js
// ...
function _createMdxContent(props) {
  // ...
  const {Component1, Component2} = _components;
  // ...
}
```

Basically, the `recma-mdx-escape-missing-components`;

🟩 **inserts an Empty Component definition into the code above the function `_createMdxContent(props){}`**

`const _EmptyComponent = () => null;`

🟩 **looks for a declaration statement in an object pattern initiated by the `_components`**

`const {Component1, Component2} = _components;`

🟩 **converts it as the destructed components have a default value `_EmptyComponent`**

`const {Component1 = _EmptyComponent, Component2 = _EmptyComponent} = _components;`

## Options

```typescript
type TestFunction = (componentName: string) => boolean | undefined | null;

function recmaMdxEscapeMissingComponents(test?: string | string[] | TestFunction)
```

#### `test`
+ if "undefined", all components pass the check.
+ if "string", check the component name matches with the string.
+ if "string[]", check the component name is included in the string array.
+ if "TestFunction", check the test function returns true.
+ if check is true/pass, set the default value `() => null` for that component.

## Examples:

```markdown
# Hi

<Component1 />

Wellcome

<Component2 />
```

#### Without the `test` option

```javascript
use(recmaMdxEscapeMissingComponents);
```

is going to produce the compiled source has the statement for all components have the default value:

`const {Component1 = _EmptyComponent, Component2 = _EmptyComponent} = _components;`

#### With the `test` option (string)

```javascript
use(recmaMdxEscapeMissingComponents, "Component1");
```

is going to produce the compiled source has the statement for only the `Component1` has the default value:

`const {Component1 = _EmptyComponent, Component2} = _components;`

#### With the `test` option (string array)

```javascript
use(recmaMdxEscapeMissingComponents, ["Component1"]);
```
is going to produce the compiled source has the statement for only the `Component1` has the default value:

`const {Component1 = _EmptyComponent, Component2} = _components;`

#### With the `test` option (function)

```javascript
use(recmaMdxEscapeMissingComponents, ((name) => name.endsWith("2")) as TestFunction);
```
is going to produce the compiled source has the statement for only the `Component2` has the default value:

`const {Component1, Component2 = _EmptyComponent} = _components;`

## Syntax tree

This plugin only modifies the ESAST (Ecma Script Abstract Syntax Tree) as explained.

## Types

This package is fully typed with [TypeScript][url-typescript]. Test function in the option is exported as type `TestFunction`.

## Compatibility

This plugin works with `unified` version 6+. It is compatible with `mdx` version 3+.

## Security

Use of `recma-mdx-escape-missing-components` doesn't involve user content so there are no openings for cross-site scripting (XSS) attacks.

## My Plugins

I like to contribute the Unified / Remark / MDX ecosystem, so I recommend you to have a look my plugins.

### My Remark Plugins

- [`remark-flexible-code-titles`](https://www.npmjs.com/package/remark-flexible-code-titles)
  – Remark plugin to add titles or/and containers for the code blocks with customizable properties
- [`remark-flexible-containers`](https://www.npmjs.com/package/remark-flexible-containers)
  – Remark plugin to add custom containers with customizable properties in markdown
- [`remark-ins`](https://www.npmjs.com/package/remark-ins)
  – Remark plugin to add `ins` element in markdown
- [`remark-flexible-paragraphs`](https://www.npmjs.com/package/remark-flexible-paragraphs)
  – Remark plugin to add custom paragraphs with customizable properties in markdown
- [`remark-flexible-markers`](https://www.npmjs.com/package/remark-flexible-markers)
  – Remark plugin to add custom `mark` element with customizable properties in markdown
- [`remark-flexible-toc`](https://www.npmjs.com/package/remark-flexible-toc)
  – Remark plugin to expose the table of contents via `vfile.data` or via an option reference
- [`remark-mdx-remove-esm`](https://www.npmjs.com/package/remark-mdx-remove-esm)
  – Remark plugin to remove import and/or export statements (mdxjsEsm)

### My Rehype Plugins

- [`rehype-pre-language`](https://www.npmjs.com/package/rehype-pre-language)
  – Rehype plugin to add language information as a property to `pre` element
- [`rehype-highlight-code-lines`](https://www.npmjs.com/package/rehype-highlight-code-lines)
  – Rehype plugin to add line numbers to code blocks and allow highlighting of desired code lines
- [`rehype-code-meta`](https://www.npmjs.com/package/rehype-code-meta)
  – Rehype plugin to copy `code.data.meta` to `code.properties.metastring`
- [`rehype-image-toolkit`](https://www.npmjs.com/package/rehype-image-toolkit)
  – Rehype plugin to enhance Markdown image syntax `![]()` and Markdown/MDX media elements (`<img>`, `<audio>`, `<video>`) by auto-linking bracketed or parenthesized image URLs, wrapping them in `<figure>` with optional captions, unwrapping images/videos/audio from paragraph, parsing directives in title for styling and adding attributes, and dynamically converting images into `<video>` or `<audio>` elements based on file extension.

### My Recma Plugins

- [`recma-mdx-escape-missing-components`](https://www.npmjs.com/package/recma-mdx-escape-missing-components)
  – Recma plugin to set the default value `() => null` for the Components in MDX in case of missing or not provided so as not to throw an error
- [`recma-mdx-change-props`](https://www.npmjs.com/package/recma-mdx-change-props)
  – Recma plugin to change the `props` parameter into the `_props` in the `function _createMdxContent(props) {/* */}` in the compiled source in order to be able to use `{props.foo}` like expressions. It is useful for the `next-mdx-remote` or `next-mdx-remote-client` users in `nextjs` applications.
- [`recma-mdx-change-imports`](https://www.npmjs.com/package/recma-mdx-change-imports)
  – Recma plugin to convert import declarations for assets and media with relative links into variable declarations with string URLs, enabling direct asset URL resolution in compiled MDX.
- [`recma-mdx-import-media`](https://www.npmjs.com/package/recma-mdx-import-media)
  – Recma plugin to turn media relative paths into import declarations for both markdown and html syntax in MDX.
- [`recma-mdx-import-react`](https://www.npmjs.com/package/recma-mdx-import-react)
  – Recma plugin to ensure getting `React` instance from the arguments and to make the runtime props `{React, jsx, jsxs, jsxDev, Fragment}` is available in the dynamically imported components in the compiled source of MDX.
- [`recma-mdx-html-override`](https://www.npmjs.com/package/recma-mdx-html-override)
  – Recma plugin to allow selected raw HTML elements to be overridden via MDX components.
- [`recma-mdx-interpolate`](https://www.npmjs.com/package/recma-mdx-interpolate)
  – Recma plugin to enable interpolation of identifiers wrapped in curly braces within the `alt`, `src`, `href`, and `title` attributes of markdown link and image syntax in MDX.

## License

[MIT License](./LICENSE) © ipikuka

[unified]: https://github.com/unifiedjs/unified
[micromark]: https://github.com/micromark/micromark
[recma]: https://mdxjs.com/docs/extending-mdx/#list-of-plugins
[esast]: https://github.com/syntax-tree/esast
[estree]: https://github.com/estree/estree
[MDX]: https://mdxjs.com/

[badge-npm-version]: https://img.shields.io/npm/v/recma-mdx-escape-missing-components
[badge-npm-download]:https://img.shields.io/npm/dt/recma-mdx-escape-missing-components
[url-npm-package]: https://www.npmjs.com/package/recma-mdx-escape-missing-components
[url-github-package]: https://github.com/ipikuka/recma-mdx-escape-missing-components

[badge-license]: https://img.shields.io/github/license/ipikuka/recma-mdx-escape-missing-components
[url-license]: https://github.com/ipikuka/recma-mdx-escape-missing-components/blob/main/LICENSE

[badge-publish-to-npm]: https://github.com/ipikuka/recma-mdx-escape-missing-components/actions/workflows/publish.yml/badge.svg
[url-publish-github-actions]: https://github.com/ipikuka/recma-mdx-escape-missing-components/actions/workflows/publish.yml

[badge-typescript]: https://img.shields.io/npm/types/recma-mdx-escape-missing-components
[url-typescript]: https://www.typescriptlang.org/

[badge-codecov]: https://codecov.io/gh/ipikuka/recma-mdx-escape-missing-components/graph/badge.svg?token=F89TVSB5MU
[url-codecov]: https://codecov.io/gh/ipikuka/recma-mdx-escape-missing-components