export default location => (
	new URL(location || '', window.location.origin).origin === window.location.origin
);
