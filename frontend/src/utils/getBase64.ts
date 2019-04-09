export default (file: File): Promise<string> | null => {
	if (!file) return null;
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		// @ts-ignore
		reader.onload = () => resolve(reader.result!);
		reader.onerror = error => reject(error);
	});
};
