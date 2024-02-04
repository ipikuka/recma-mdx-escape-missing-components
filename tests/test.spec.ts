import { compile } from "@mdx-js/mdx";
import dedent from "dedent";

import recmaEscapeMissingComponents, { type TestFunction } from "../src";

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
      recmaPlugins: [recmaEscapeMissingComponents],
    });

    expect(String(compiledSource)).toContain("const _EmptyComponent = () => null;");

    expect(String(compiledSource)).toContain(
      "{Component1 = _EmptyComponent, Component2 = _EmptyComponent} = _components;",
    );
  });
});

describe("with the plugin (has `test` option)", () => {
  // ******************************************
  it("sets the default value '() => null' for the component passes the test (string)", async () => {
    const source = dedent`
      # Hi.
      
      <Component1 />
      
      Wellcome.
      
      <Component2 />
    `;

    const compiledSource = await compile(source, {
      recmaPlugins: [[recmaEscapeMissingComponents, "Component1"]],
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
      recmaPlugins: [[recmaEscapeMissingComponents, ["Component1"]]],
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
        [recmaEscapeMissingComponents, ((name) => name.endsWith("2")) as TestFunction],
      ],
    });

    expect(String(compiledSource)).toContain("const _EmptyComponent = () => null;");

    expect(String(compiledSource)).toContain(
      "{Component1, Component2 = _EmptyComponent} = _components;",
    );
  });
});
