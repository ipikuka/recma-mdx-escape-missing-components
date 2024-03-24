# recma-mdx-escape-missing-components

[![NPM version][npm-image]][npm-url]
[![Build][github-build]][github-build-url]
![npm-typescript]
[![License][github-license]][github-license-url]
[![codecov](https://codecov.io/gh/ipikuka/recma-mdx-escape-missing-components/graph/badge.svg?token=F89TVSB5MU)](https://codecov.io/gh/ipikuka/recma-mdx-escape-missing-components)
[![type-coverage](https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fipikuka%2Frecma-mdx-escape-missing-components%2Fmaster%2Fpackage.json)](https://github.com/ipikuka/recma-mdx-escape-missing-components)

This package provides escaping the components in the MDX, which are missing or not provided.

It is compatible with [MDX][MDX] version 3.

**This plugin is a [recma][recma] plugin that transforms the ESAST which stands for Ecma Script Abstract Syntax Tree (AST) that is used in production of compiled source for the MDX.**

## When should I use this?

**This plugin is useful if you want to escape the components you did not provide in MDX.** You don't receive an error for missing / not provided components since the `recma-mdx-escape-missing-components` sets the default value `() => null` for the components.

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

Say we have the following file, `example.mdx`, which consists some Components.

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
const _EmptyComponent = () => null;
function _createMdxContent(props) {
  // ...
  const {Component1 = _EmptyComponent, Component2 = _EmptyComponent} = _components;
  // ...
}
```

Without the `recma-mdx-escape-missing-components`, you’d not get any Empty Component definition and default value for the components:

```js
function _createMdxContent(props) {
  // ...
  const {Component1, Component2} = _components;
  // ...
}
```

Basically, the `recma-mdx-escape-missing-components`;

**inserts the Empty Component definition into the code above the function `_createMdxContent(props){}`**

`const _EmptyComponent = () => null;`

**looks for a declaration statement in an object pattern initiated by the `_components`**

`const {Component1, Component2} = _components;`

**converts it as the destructed properties (Components) having a default value `_EmptyComponent`**

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

This package is fully typed with [TypeScript][typeScript]. Function type for the `test` option is exported as `TestFunction`.

## Compatibility

This plugin works with unified version 6+ and estree version 2+. **It is compatible with mdx version 3**.

## Security

Use of `recma-mdx-escape-missing-components` does not involve user content so there are no openings for cross-site scripting (XSS) attacks.

## My Recma Plugins

+ [`recma-mdx-escape-missing-components`](https://www.npmjs.com/package/recma-mdx-escape-missing-components)
  – Recma plugin to set the default value `() => null` for the Components in MDX in case of missing or not provided
+ [`recma-mdx-change-props`](https://www.npmjs.com/package/recma-mdx-change-props)
  – Recma plugin to change the 'props' parameter into '_props' in the function '_createMdxContent' in the compiled source in order to be able to use {props.foo} like expressions. It is useful for the `next-mdx-remote` or `next-mdx-remote-client` users in `nextjs` applications.

## License

[MIT][license] © ipikuka

### Keywords

[unified][unifiednpm] [recma][recmanpm] [recma-plugin][recmapluginnpm] [esast][esastnpm] [MDX][MDXnpm]

[unified]: https://github.com/unifiedjs/unified
[unifiednpm]: https://www.npmjs.com/search?q=keywords:unified
[recma]: https://mdxjs.com/docs/extending-mdx/#list-of-plugins
[recmanpm]: https://www.npmjs.com/search?q=keywords:recma
[recmapluginnpm]: https://www.npmjs.com/search?q=keywords:recma%20plugin
[esast]: https://github.com/syntax-tree/esast
[esastnpm]: https://www.npmjs.com/search?q=keywords:esast
[MDX]: https://mdxjs.com/
[MDXnpm]: https://www.npmjs.com/search?q=keywords:mdx
[typescript]: https://www.typescriptlang.org/
[license]: https://github.com/ipikuka/recma-mdx-escape-missing-components/blob/main/LICENSE
[markdownnpm]: https://www.npmjs.com/search?q=keywords:markdown
[recmaEMCnpm]: https://www.npmjs.com/search?q=keywords:recma%20custom%20escape%20missing%20components
[npm-url]: https://www.npmjs.com/package/recma-mdx-escape-missing-components
[npm-image]: https://img.shields.io/npm/v/recma-mdx-escape-missing-components
[github-license]: https://img.shields.io/github/license/ipikuka/recma-mdx-escape-missing-components
[github-license-url]: https://github.com/ipikuka/recma-mdx-escape-missing-components/blob/master/LICENSE
[github-build]: https://github.com/ipikuka/recma-mdx-escape-missing-components/actions/workflows/publish.yml/badge.svg
[github-build-url]: https://github.com/ipikuka/recma-mdx-escape-missing-components/actions/workflows/publish.yml
[npm-typescript]: https://img.shields.io/npm/types/recma-mdx-escape-missing-components
