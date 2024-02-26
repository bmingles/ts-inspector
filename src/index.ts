import * as ts from 'typescript';

if (process.argv.length < 3) {
  console.error(
    `Missing required <targetFile> argument.

Usage: node . <targetFile> [identifiers]

  targetFile: The file to extract top level identifiers from.

  identifiers: Optional list of top level identifiers to extract from the target file.
`
  );
  process.exit(1);
}

const [targetFile, ...identifiers] = process.argv.slice(2);
extract(targetFile, identifiers);

/**
 * Prints out property info for top level types from a source file
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

      // TODO: Group results by categories like in the Spectrum docs:
      // https://github.com/adobe/react-spectrum/blob/fa3862eab668b43459dd99f7fd4bf74e6eda492b/packages/dev/docs/src/PropTable.js#L18
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
