# Ts Inspector

Print property information from top level type / interfaces in a target `.ts` file.

## Usage

Install dependencies and build the script

```sh
npm i
npm run build
```

Run the script with target file and optional identifiers args

```sh
npm start \
 test/test.ts \
 ChildInterface \
 ChildType
```

This will parse the content in `test/test.ts`

```typescript
interface Parent {
  /** Name prop */
  name: string;

  /**
   * Multiline comment for
   * some prop.
   */
  age: number;
}

interface ChildInterface extends Parent {
  label: string;
}

type ChildType = Parent & {
  someOther: string;
};
```

and will output:

```text
ChildInterface

label: string

/**
 * Name prop
 */
name: string

/**
 * Multiline comment for
 * some prop.
 */
age: number

ChildType

/**
 * Name prop
 */
name: string

/**
 * Multiline comment for
 * some prop.
 */
age: number

someOther: string
```

Note that it included the `Parent` interface props in each of the child types.

Here's an example targetting the `SpectrumPickerProps` interface from `@react-types/select`.

```sh
npm start \
 node_modules/@react-types/select/src/index.d.ts \
 SpectrumPickerProps
```

For now, this just dumps the output to stdout, but you can always pipe it to a file.

## Note on Spectrum Docs

This was originally intended as a tool to extract props info from React Spectrum component types. Spectrum's docs include a categorization mappings for separating component specific props from common props. Similar categorization mapping could be applied in this script to group props output:
https://github.com/adobe/react-spectrum/blob/fa3862eab668b43459dd99f7fd4bf74e6eda492b/packages/dev/docs/src/PropTable.js#L18
