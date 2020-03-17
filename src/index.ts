let engine: (length: number) => Uint8Array;

export function setPRNGEngine(random: (length: number) => Uint8Array) {
    engine = random;
}

export function randomBytes(length: number): Uint8Array {
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
        let x = new Uint8Array(length);
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
    if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
        const RNGetRandomValues = require('react-native').NativeModules.RNGetRandomValues;
        const base64Decode = require('fast-base64-decode');
        engine = function (length: number) {
            let res = new Uint8Array(length);
            let random = RNGetRandomValues.getRandomBase64(length);
            base64Decode(random, res);
            return res;
        }
    } else {
        /* 
         * React Native will crash during file parsing 
         * if using require directly
         */
        let nodeCrypto = require.call(null, 'crypto');
        if (nodeCrypto && nodeCrypto.randomBytes) {
            engine = function (length: number) {
                return nodeCrypto.randomBytes(length);
            };
        }
    }
}