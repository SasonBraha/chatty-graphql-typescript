const validCss = (value: string | number): string => {
	return typeof value === 'string' ? value : `${value}px`;
};

export default validCss;
