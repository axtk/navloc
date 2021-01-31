const ANY_ORIGIN = 'https://c.cc';

export default path => new URL(path == null ? '' : path, ANY_ORIGIN).pathname;
