import * as sanitizeHtml from 'sanitize-html';

class Sanitizer {
	private readonly excluded: { [key: string]: boolean } = {
		file: true,
		limit: true,
		first: true,
		last: true
	};

	public incomingRequest(variables: { [key: string]: any }) {
		for (let key in variables) {
			if (this.excluded[key]) continue;
			variables[key] = this.html(variables[key]);
			variables[key] = this.query(variables[key]);
		}
	}

	public html(text: any): string {
		return sanitizeHtml(text, {
			allowedTags: [],
			allowedAttributes: {}
		});
	}

	public query(text: any) {
		return text;
	}
}

const sanitizer = new Sanitizer();

export default sanitizer;
