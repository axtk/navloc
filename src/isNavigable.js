export default e => e.href !== undefined && new URL(e.href).origin === window.location.origin;
