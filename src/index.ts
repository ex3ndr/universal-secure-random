let engine: (length: number) => Buffer;

export function setPRNGEngine(random: (length: number) => Buffer) {
    engine = random;
}

export function randomBytes(length: number): Buffer {
    if (!engine) {
        throw Error('Unable to detect Engine');
    }
    return engine(length);
}

//
// Detect Default Random Generators
//

// Browsers or React Native
var crypto = typeof self !== 'undefined' ? (self.crypto || (self as any).msCrypto) : null;
if (crypto && crypto.getRandomValues) {
    var QUOTA = 65536;
    engine = function (length: number) {
        let x = Buffer.alloc(length);
        var v = new Uint8Array(length);
        for (let i = 0; i < length; i += QUOTA) {
            crypto!.getRandomValues(v.subarray(i, i + Math.min(length - i, QUOTA)));
        }
        for (let i = 0; i < length; i++) {
            x[i] = v[i];
            v[i] = 0;
        }
        return x;
    };
} else if (typeof require !== 'undefined') {
    let nodeCrypto = require('crypto');
    if (nodeCrypto && nodeCrypto.randomBytes) {
        engine = function (length: number) {
            return nodeCrypto.randomBytes(length);
        };
    } else if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
        const RNGetRandomValues = require('react-native').NativeModules.RNGetRandomValues;
        const base64Decode = require('fast-base64-decode');
        engine = function (length: number) {
            let res = Buffer.alloc(length);
            let random = RNGetRandomValues.getRandomBase64(length);
            base64Decode(random, res);
            return res;
        }
    }
}