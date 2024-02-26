# Ts Inspector

Inpsect TypeScript types using compiler api

## Usage

Build the script

```sh
npm run build
```

Run the script with target file and optional identifiers args

```sh
# Extract `SpectrumPickerProps` type from `@react-types/select` package
npm start \
 node_modules/@react-types/select/src/index.d.ts \
 SpectrumPickerProps
```
