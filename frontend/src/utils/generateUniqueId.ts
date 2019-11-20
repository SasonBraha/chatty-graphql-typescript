const generateUniqueId = (): string =>
	`${Number(
		(
			new Date().valueOf() +
			Math.random() * 1000 +
			Math.random() * 1000
		).toFixed()
	)}${Math.random()}`
		.split('.')
		.join('');

export default generateUniqueId;
