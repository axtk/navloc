import isSameOrigin from './isSameOrigin';

export default e => e.href !== undefined && isSameOrigin(e.href);
