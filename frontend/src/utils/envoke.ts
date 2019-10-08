const invoke = (fn: () => any) => {
	if (typeof fn === 'function') {
		fn();
	}
};

export default invoke;
