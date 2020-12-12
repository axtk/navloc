export default location => {
	let {pathname, search, hash} = location ?
		new URL(location, window.location.origin) :
		new URL(window.location.href);

	return pathname + search + hash;
};
