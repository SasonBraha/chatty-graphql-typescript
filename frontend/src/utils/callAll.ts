const callAll = (...fns: Array<(...any) => any>) => (...args: Array<any>) =>
	fns.forEach(fn => fn && fn(...args));

export default callAll;
