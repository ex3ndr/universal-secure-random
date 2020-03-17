# Universal Secure Random
[![Version npm](https://img.shields.io/npm/v/universal-secure-random.svg?logo=npm)](https://www.npmjs.com/package/universal-secure-random)

Simple module for secure random number generation in NodeJS, Browser and React Native.

# Install
```bash
yarn add universal-secure-random
```

# Install for React Native
For generation secure random numbers on React Native `react-native-get-random-values` is required. 
No need to import it directly. It will use the library automatically.

```bash
yarn add react-native-get-random-values
```

## Example
```js
import { randomBytes } from 'universal-secure-random';
let bytes: UInt8Array = randomBytes(32);
```

# License
[MIT](LICENSE)
