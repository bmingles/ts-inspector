import * as ts from 'typescript';

/**
 * Prints out particular nodes from a source file
 *
 * @param file a path to a file
 * @param identifiers top level identifiers available
 */
function extract(file: string, identifiers: string[]): void {
  // Create a Program to represent the project, then pull out the
  // source file to parse its AST.
  let program = ts.createProgram([file], { allowJs: true });
  const typeChecker = program.getTypeChecker();

  const sourceFile = program.getSourceFile(file);
  if (sourceFile == null) {
    return;
  }

  // To print the AST, we'll use TypeScript's printer
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  // To give constructive error messages, keep track of found and un-found identifiers
  const unfoundNodes: [string, ts.Node][] = [],
    foundNodes: [string, ts.Node][] = [];

  // Loop through the root AST nodes of the file
  ts.forEachChild(sourceFile, node => {
    let name = '';

    // This is an incomplete set of AST nodes which could have a top level identifier
    // it's left to you to expand this list, which you can do by using
    // https://ts-ast-viewer.com/ to see the AST of a file then use the same patterns
    // as below
    if (ts.isFunctionDeclaration(node)) {
      name = node.name.text;
      // Hide the method body when printing
      node.body = undefined;
    } else if (ts.isVariableStatement(node)) {
      name = node.declarationList.declarations[0].name.getText(sourceFile);
    } else if (
      ts.isInterfaceDeclaration(node) ||
      ts.isTypeAliasDeclaration(node)
    ) {
      name = node.name.text;

      // Does not match identifier filter
      if (identifiers.length > 0 && !identifiers.includes(name)) {
        return;
      }

      console.log(`\n${name}`);
      const type = typeChecker.getTypeAtLocation(node);
      typeChecker.getPropertiesOfType(type).forEach(prop => {
        const propName = prop.escapedName;
        const propComment = prop
          .getDocumentationComment(typeChecker)
          .map(c => c.text)
          .join('\n');
        const propType = typeChecker.typeToString(
          typeChecker.getTypeOfSymbol(prop)
        );
        console.log(`\n/** ${propComment} */\n${propName}: ${propType}`);
      });
      // ts.forEachChild(node, child => {
      //   console.log('child:', child);
      // });
    }

    // const container = identifiers.includes(name) ? foundNodes : unfoundNodes;
    // container.push([name, node]);
  });

  // Either print the found nodes, or offer a list of what identifiers were found
  // if (!foundNodes.length) {
  //   console.log(
  //     `Could not find any of ${identifiers.join(
  //       ', '
  //     )} in ${file}, found: ${unfoundNodes
  //       .filter(f => f[0])
  //       .map(f => f[0])
  //       .join(', ')}.`
  //   );
  //   process.exitCode = 1;
  // } else {
  //   foundNodes.map(f => {
  //     const [name, node] = f;
  //     console.log('### ' + name + '\n');
  //     console.log(
  //       printer.printNode(ts.EmitHint.Unspecified, node, sourceFile)
  //     ) + '\n';
  //   });
  // }
}

// Run the extract function with the script's arguments
extract(process.argv[2], process.argv.slice(3));
