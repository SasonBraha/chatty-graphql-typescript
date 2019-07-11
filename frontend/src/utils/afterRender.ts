const afterRender = (callback: () => any) => {
	requestAnimationFrame(() => requestAnimationFrame(() => {
		callback();
	}));
}

export default afterRender;
