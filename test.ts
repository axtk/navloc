import {SimpleURL} from './lib/IsomorphicURL';
import {getPath} from './src/getPath';

let url, urlProps;

url = new SimpleURL('https://c.cc:80/a/b/c?d=e#hi');
urlProps = {
    hash: '#hi',
    href: 'https://c.cc:80/a/b/c?d=e#hi',
    origin: 'https://c.cc:80',
    pathname: '/a/b/c',
    search: '?d=e',
};

console.log(`new SimpleURL('https://c.cc:80/a/b/c?d=e#hi')`);
for (let [k, v] of Object.entries(urlProps))
    console.assert(url[k] === v, k);

url = new SimpleURL('https://c.cc/x/yz#hi', 'https://example.com');
urlProps = {
    hash: '#hi',
    href: 'https://c.cc/x/yz#hi',
    origin: 'https://c.cc',
    pathname: '/x/yz',
    search: '',
};

console.log(`new SimpleURL('https://c.cc/x/yz#hi', 'https://example.com')`);
for (let [k, v] of Object.entries(urlProps))
    console.assert(url[k] === v, k);

url = new SimpleURL('/x/yz?q=123&a=b', 'https://example.com/test');
urlProps = {
    hash: '',
    href: 'https://example.com/x/yz?q=123&a=b',
    origin: 'https://example.com',
    pathname: '/x/yz',
    search: '?q=123&a=b',
};

console.log(`new SimpleURL('/x/yz?q=123&a=b', 'https://example.com')`);
for (let [k, v] of Object.entries(urlProps))
    console.assert(url[k] === v, k);

url = new SimpleURL('test', 'https://example.com/x');
urlProps = {
    hash: '',
    href: 'https://example.com/test',
    origin: 'https://example.com',
    pathname: '/test',
    search: '',
};

console.log(`new SimpleURL('test', 'https://example.com/x')`);
for (let [k, v] of Object.entries(urlProps))
    console.assert(url[k] === v, k);

// @ts-ignore numeric arg instead of string
url = new SimpleURL(10, 'https://example.com');
urlProps = {
    hash: '',
    href: 'https://example.com/10',
    origin: 'https://example.com',
    pathname: '/10',
    search: '',
};

console.log(`new SimpleURL(10, 'https://example.com')`);
for (let [k, v] of Object.entries(urlProps))
    console.assert(url[k] === v, k);

console.log('getPath');
console.assert(getPath('https://example.com/test') === '/test', 'simple path');
console.assert(getPath('https://example.com/x/test') === '/x/test', 'simple nested path');
console.assert(getPath('https://example.com/x/test?z=value') === '/x/test?z=value', 'path with param');
console.assert(getPath('https://example.com/x/test?z=value', {search: false}) === '/x/test', 'path with disregarded param');
