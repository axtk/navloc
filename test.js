import getSubpath from './lib/getSubpath';

console.assert(getSubpath('/', '/x') === null, 'root');
console.assert(getSubpath('/x', '/x') === '/', 'same');
console.assert(getSubpath('/x/', '/x') === '/', 'same + slash');
console.assert(getSubpath('/x/y', '/x') === '/y', 'valid subpath');
console.assert(getSubpath('/x/y/', '/x') === '/y/', 'valid subpath + slash');
console.assert(getSubpath('/x/y?z=test', '/x') === '/y?z=test', 'valid subpath + params');
console.assert(getSubpath('/x/y/?z=test', '/x') === '/y/?z=test', 'valid subpath + slash + params');
console.assert(getSubpath('/x/y/abc', '/x') === '/y/abc', 'valid nested subpath');
console.assert(getSubpath('/x0abc/y', '/x') === null, 'invalid subpath');
console.assert(getSubpath('/xt/y/abc', '/x') === null, 'invalid nested subpath');
