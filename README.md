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
# Extract `SpectrumPickerProps` type from `@react-types/select` package
npm start \
 node_modules/@react-types/select/src/index.d.ts \
 SpectrumPickerProps
```

For now, this just dumps the output to stdout, but you can always pipe it to a file.
