# Dindist

Because https://github.com/prisma/nexus-prisma/issues/50 :(

# Usage

```
yarn add dindist
```

## Example

```ts
import dindist from 'dindist'

console.log(dindist`
  All the nice stuff from endent except the following works too (\\n doesn't trigger a line break):

  \\a\\b\\c\\node_modules\\d
`)

// All the nice stuff from endent except the following works too:
//
// \a\b\c\node_modules\d
```
