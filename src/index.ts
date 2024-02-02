import { CONTINUE, visit } from "estree-util-visit";
import { type Node } from "estree";

export type TestFunction = (componentName: string) => boolean | undefined | null;

function passTest(test: string | string[] | TestFunction | undefined, componentName: string) {
  const pass =
    typeof test === "undefined" ||
    (typeof test === "string" && test === componentName) ||
    (Array.isArray(test) && test.includes(componentName)) ||
    (typeof test === "function" && test(componentName));

  return pass;
}

/**
 * It is a recma plugin which transforms the esAST / esTree.
 *
 * This recma plugin sets the default value `() => null` for the Components in case them missing or not provided.
 * in order "eval of the MDX compiled source" NOT to throw an error.
 *
 * The "recma-escape-missing-components" basically:
 *
 * looks for a declaration statement in an object pattern initiated by the `_components`
 *
 * const { Component1, Component2 } = _components;
 *
 * converts it as the destructed properties (Components) having a default value `() => null`
 *
 * const { Component1 = () => null, Component2 = () => null } = _components;
 *
 * @param [test]
 * if "undefined", all components pass the check
 * if "string", check the component name matches with the string
 * if "string[]", check the component name is included in the string array
 * if "TestFunction", check the test function returns true.
 * if check is true/pass, set the default value `() => null` for that component
 */
export default function RecmaEscapeMissingComponents(test?: string | string[] | TestFunction) {
  return (tree: Node) => {
    visit(tree, function (node) {
      if (node.type !== "VariableDeclarator") return CONTINUE;

      if (node.id.type !== "ObjectPattern") return CONTINUE;

      // we are looking for the "_components" identifier is destructed in the code
      if (node.init?.type === "Identifier" && node.init?.name === "_components") {
        node.id.properties.forEach((property) => {
          if (property.type === "RestElement") return CONTINUE;

          /**
           *
           * now we ensure here: Variable Declaration Assignment in ObjectPattern
           *
           * const { Component1, Component2 } = _components;
           *          Property    Property
           *
           */

          if (
            // ensures that there is no default value
            property.key.type === "Identifier" &&
            property.value.type === "Identifier"
          ) {
            const componentName = property.key.name;

            if (!passTest(test, componentName)) return;

            // now we set the property value with `() => null`
            property.value = {
              type: "AssignmentPattern",
              left: {
                type: "Identifier",
                name: componentName,
              },
              right: {
                type: "ArrowFunctionExpression",
                expression: true,
                generator: false,
                async: false,
                params: [],
                body: {
                  type: "Literal",
                  value: null,
                },
              },
            };
          }

          return CONTINUE;
        });
      }

      return CONTINUE;
    });
  };
}
