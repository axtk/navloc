export default e => {
	if (e.href === undefined)
		return false;

	try {
		return new URL(e.href).origin === window.location.origin;
	}
	catch(e) {}
};
