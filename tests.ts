import {SimpleURL} from './lib/IsomorphicURL';
import {Location} from './src/Location';
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
console.assert(getPath('https://example.com/x/test?q=value') === '/x/test?q=value', 'path with param');
console.assert(getPath('https://example.com/x/test?q=value', {search: false}) === '/x/test', 'path with disregarded param');

class PathLocation extends Location {
    deriveHref(location) {
        return getPath(location, {search: false, hash: false});
    }
}

let locationURL = '/x/test?q=value#hash-hash';

const location = new Location(locationURL);
const pathLocation = new PathLocation(locationURL);

console.log('Location vs PathLocation: initial href');
console.assert(location.href === locationURL, 'Location href');
console.assert(pathLocation.href === locationURL.split('?')[0], 'PathLocation href');

location.onChange(e => console.log(`location change: ${JSON.stringify(e)}`));
pathLocation.onChange(({href}) => console.log(`pathLocation change: ${JSON.stringify({href})}`));

location.addListener(/\?q=(?<q>[^&]+)/, e => console.log(`location listener: ${JSON.stringify(e)}`));
pathLocation.addListener(/^\/(?<section>\w)\/test/, e => console.log(`pathLocation listener: ${JSON.stringify(e)}`));

locationURL = '/y/test?q=none';

location.assign(locationURL);
pathLocation.assign(locationURL);

console.log('Location vs PathLocation: assigned href');
console.assert(location.href === locationURL, 'Location href');
console.assert(pathLocation.href === locationURL.split('?')[0], 'PathLocation href');

let match = location.match(/^\/(?<section>\w)\/(?<subsection>\w+)\/?\?q=(?<value>[^&]+)/)!;

console.log('match params');
console.assert(match.section === 'y', 'match section');
console.assert(match.subsection === 'test', 'match subsection');
console.assert(match.value === 'none', 'match value');

locationURL = '/item/42';
location.assign(locationURL);

console.log('.match()');
console.assert(location.match('/home') === null, 'mismatch');
console.assert(JSON.stringify(location.match('/item/42')) === '{}', 'string match');
console.assert(JSON.stringify(location.match(/^\/item\/(?<id>\d+)\/?$/)) === '{"0":"42","id":"42"}', 'regexp match');

console.log('.matches()');
console.assert(location.matches('/home') === false, 'boolean mismatch');
console.assert(location.matches('/item/42') === true, 'boolean string match');
console.assert(location.matches(/^\/item\/(?<id>\d+)\/?$/) === true, 'boolean regexp match');

console.log('.evaluate()');
console.assert(location.evaluate('/home', 1, 0) === 0, 'eval mismatch');
console.assert(location.evaluate('/item/42', 'a', 'b') === 'a', 'eval match');
console.assert(location.evaluate(/^\/item\/(?<id>\d+)\/?$/, 5) === 5, 'regexp eval match');

console.log('.evaluate() fn');
console.assert(location.evaluate('/home', () => 1, ({path}) => path) === '/item/42', 'eval fn string mismatch');
console.assert(location.evaluate(/^\/item\/(?<id>\d+)\/?$/, ({params}) => params.id) === '42', 'eval fn regexp match');
