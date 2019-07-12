const removeChar = (text: string, char: string) => {
	const regex = new RegExp(char, 'gi');
	return text.replace(regex, '');
};

export default removeChar;
