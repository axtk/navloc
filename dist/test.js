import { getPath } from './src/getPath';
console.assert(getPath('https://example.com/test') === '/test', 'simple path');
console.assert(getPath('https://example.com/x/test') === '/x/test', 'simple nested path');
console.assert(getPath('https://example.com/x/test?z=value') === '/x/test?z=value', 'path with param');
console.assert(getPath('https://example.com/x/test?z=value', { search: false }) === '/x/test', 'path with disregarded param');
