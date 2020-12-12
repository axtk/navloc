export default x => {
	let url;

	if (!x)
		url = new URL(window.location.href);
	else if (x.href)
		url = new URL(x.href);
	else
		url = new URL(x, window.location.origin);

	let {pathname, search, hash} = url;
	return pathname + search + hash;
};
