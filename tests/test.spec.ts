import { compile } from "@mdx-js/mdx";
import { visit } from "estree-util-visit";
import { fromJs } from "esast-util-from-js";
import dedent from "dedent";

import recmaMdxEscapeMissingComponents, { type TestFunction } from "../src";

describe("compose the Empty Component statement", () => {
  // ******************************************
  it("checks the statement", async () => {
    const compiledSource = dedent`
      const _EmptyComponent = () => null;
    `;

    const estree = fromJs(compiledSource);

    visit(estree, function (node) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (node as any).position;
    });

    expect(estree.body[0]).toMatchInlineSnapshot(`
      {
        "declarations": [
          {
            "id": {
              "name": "_EmptyComponent",
              "type": "Identifier",
            },
            "init": {
              "async": false,
              "body": {
                "type": "Literal",
                "value": null,
              },
              "expression": true,
              "generator": false,
              "id": null,
              "params": [],
              "type": "ArrowFunctionExpression",
            },
            "type": "VariableDeclarator",
          },
        ],
        "kind": "const",
        "type": "VariableDeclaration",
      }
    `);
  });
});

describe("without the plugin", () => {
  // ******************************************
  it("sets no default value for the components (the default behaviour)", async () => {
    const source = dedent`
      # Hi.
      
      <Component1 />
      
      Wellcome.
      
      <Component2 />
    `;

    const compiledSource = await compile(source);

    expect(String(compiledSource)).toContain("{Component1, Component2} = _components;");
  });
});

describe("with the plugin (no option)", () => {
  // ******************************************
  it("sets the default value '() => null' for all components", async () => {
    const source = dedent`
      # Hi.
      
      <Component1 />
      
      Wellcome.
      
      <Component2 />
    `;

    const compiledSource = await compile(source, {
      recmaPlugins: [recmaMdxEscapeMissingComponents],
    });

    expect(String(compiledSource)).toContain("const _EmptyComponent = () => null;");

    expect(String(compiledSource)).toContain(
      "{Component1 = _EmptyComponent, Component2 = _EmptyComponent} = _components;",
    );
  });

  // ******************************************
  it("in outputFormat function-body", async () => {
    const source = dedent`
      import {a} from "./file.js"

      Hi <Test />

      export const x = 5;
    `;

    const compiledSource = await compile(source, {
      providerImportSource: "#",
      outputFormat: "function-body",
      recmaPlugins: [recmaMdxEscapeMissingComponents],
    });

    expect(String(compiledSource)).toContain("const _EmptyComponent = () => null;");

    expect(String(compiledSource)).toContain("{Test = _EmptyComponent} = _components;");
  });
});

describe("with the plugin (has `test` option)", () => {
  // ******************************************
  it("sets the default value '() => null' for the components pass the test (string)", async () => {
    const source = dedent`
      # Hi.
      
      <Component1 />
      
      Wellcome.
      
      <Component2 />
    `;

    const compiledSource = await compile(source, {
      recmaPlugins: [[recmaMdxEscapeMissingComponents, "Component1"]],
    });

    expect(String(compiledSource)).toContain("const _EmptyComponent = () => null;");

    expect(String(compiledSource)).toContain(
      "{Component1 = _EmptyComponent, Component2} = _components;",
    );
  });

  // ******************************************
  it("sets the default value '() => null' for the components pass the test (string array)", async () => {
    const source = dedent`
      # Hi.
      
      <Component1 />
      
      Wellcome.
      
      <Component2 />
    `;

    const compiledSource = await compile(source, {
      recmaPlugins: [[recmaMdxEscapeMissingComponents, ["Component1"]]],
    });

    expect(String(compiledSource)).toContain("const _EmptyComponent = () => null;");

    expect(String(compiledSource)).toContain(
      "{Component1 = _EmptyComponent, Component2} = _components;",
    );
  });

  // ******************************************
  it("sets the default value '() => null' for the components pass the test (function)", async () => {
    const source = dedent`
      # Hi.
      
      <Component1 />
      
      Wellcome.
      
      <Component2 />
    `;

    const compiledSource = await compile(source, {
      recmaPlugins: [
        [recmaMdxEscapeMissingComponents, ((name) => name.endsWith("2")) as TestFunction],
      ],
    });

    expect(String(compiledSource)).toContain("const _EmptyComponent = () => null;");

    expect(String(compiledSource)).toContain(
      "{Component1, Component2 = _EmptyComponent} = _components;",
    );
  });
});
