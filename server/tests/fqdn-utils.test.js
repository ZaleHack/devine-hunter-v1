const assert = require('assert');
const { normalizeFqdn } = require('../utils/fqdn');

const cases = [
    { input: '  HTTPS://WWW.Example.COM/path?query', expected: 'www.example.com' },
    { input: 'www.api.example.com', expected: 'www.api.example.com' },
    { input: 'api.example.com.', expected: 'api.example.com' },
    { input: 'user:pass@WWW.example.com', expected: 'www.example.com' },
    { input: undefined, expected: '' },
    { input: '   ', expected: '' },
];

cases.forEach(({ input, expected }) => {
    assert.strictEqual(
        normalizeFqdn(input),
        expected,
        `normalizeFqdn(${JSON.stringify(input)}) should equal ${expected}`
    );
});

console.log('normalizeFqdn tests passed');
