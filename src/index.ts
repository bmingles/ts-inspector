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
    if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) {
      const name = node.name.text;

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
    }
  });
}

// Run the extract function with the script's arguments
extract(process.argv[2], process.argv.slice(3));
