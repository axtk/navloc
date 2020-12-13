export default element => {
    if (!element || element.href === undefined)
        return false;

    try {
        return new URL(element.href).origin === window.location.origin;
    }
    catch(e) {}
};
