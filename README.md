# recma-mdx-escape-missing-components

[![NPM version][badge-npm-version]][npm-package-url]
[![NPM downloads][badge-npm-download]][npm-package-url]
[![Build][badge-build]][github-workflow-url]
[![codecov](https://codecov.io/gh/ipikuka/recma-mdx-escape-missing-components/graph/badge.svg?token=F89TVSB5MU)](https://codecov.io/gh/ipikuka/recma-mdx-escape-missing-components)
[![type-coverage](https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fipikuka%2Frecma-mdx-escape-missing-components%2Fmaster%2Fpackage.json)](https://github.com/ipikuka/recma-mdx-escape-missing-components)
[![typescript][badge-typescript]][typescript-url]
[![License][badge-license]][github-license-url]

This package is a [unified][unified] ([recma][recma]) plugin to provide an opportunity for escaping mdx components which are missing or not provided in a MDX document.

**[unified][unified]** is a project that transforms content with abstract syntax trees (ASTs) using the new parser **[micromark][micromark]**. **[recma][recma]** adds support for producing a javascript code by transforming **[esast][esast]** which stands for Ecma Script Abstract Syntax Tree (AST) that is used in production of compiled source for the **[MDX][MDX]**.

## When should I use this?

**This plugin is useful if you want to escape mdx components you did not provide in MDX.** 

You are not going to receive an error for missing or not provided mdx components since the `recma-mdx-escape-missing-components` sets the default value **`() => null`** for the mdx components.

## Installation

This package is suitable for ESM only. In Node.js (version 16+), install with npm:

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

This package is fully typed with [TypeScript][typescript]. Test function in the option is exported as type `TestFunction`.

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

### My Recma Plugins

- [`recma-mdx-escape-missing-components`](https://www.npmjs.com/package/recma-mdx-escape-missing-components)
  – Recma plugin to set the default value `() => null` for the Components in MDX in case of missing or not provided so as not to throw an error
- [`recma-mdx-change-props`](https://www.npmjs.com/package/recma-mdx-change-props)
  – Recma plugin to change the `props` parameter into the `_props` in the `function _createMdxContent(props) {/* */}` in the compiled source in order to be able to use `{props.foo}` like expressions. It is useful for the `next-mdx-remote` or `next-mdx-remote-client` users in `nextjs` applications.

## License

[MIT License](./LICENSE) © ipikuka

### Keywords

🟩 [unified][unifiednpm] 🟩 [recma][recmanpm] 🟩 [recma plugin][recmapluginnpm] 🟩 [esast][esastnpm] 🟩 [MDX][MDXnpm] 🟩 [recma mdx][recmamdxnpm]

[unifiednpm]: https://www.npmjs.com/search?q=keywords:unified
[recmanpm]: https://www.npmjs.com/search?q=keywords:recma
[recmapluginnpm]: https://www.npmjs.com/search?q=keywords:recma%20plugin
[esastnpm]: https://www.npmjs.com/search?q=keywords:esast
[MDXnpm]: https://www.npmjs.com/search?q=keywords:mdx
[recmamdxnpm]: https://www.npmjs.com/search?q=keywords:recma%20mdx

[unified]: https://github.com/unifiedjs/unified
[recma]: https://mdxjs.com/docs/extending-mdx/#list-of-plugins
[esast]: https://github.com/syntax-tree/esast
[MDX]: https://mdxjs.com/
[micromark]: https://github.com/micromark/micromark
[typescript]: https://www.typescriptlang.org/

[badge-npm-version]: https://img.shields.io/npm/v/recma-mdx-escape-missing-components
[badge-npm-download]:https://img.shields.io/npm/dt/recma-mdx-escape-missing-components
[npm-package-url]: https://www.npmjs.com/package/recma-mdx-escape-missing-components

[badge-license]: https://img.shields.io/github/license/ipikuka/recma-mdx-escape-missing-components
[github-license-url]: https://github.com/ipikuka/recma-mdx-escape-missing-components/blob/main/LICENSE

[badge-build]: https://github.com/ipikuka/recma-mdx-escape-missing-components/actions/workflows/publish.yml/badge.svg
[github-workflow-url]: https://github.com/ipikuka/recma-mdx-escape-missing-components/actions/workflows/publish.yml

[badge-typescript]: https://img.shields.io/npm/types/recma-mdx-escape-missing-components
[typescript-url]: https://www.typescriptlang.org/
