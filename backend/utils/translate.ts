import * as googleTranslate from 'google-translate';

const translate = (phrase: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		googleTranslate(process.env.GOOGLE_TRANSLATE_API_KEY).translate(
			phrase,
			'en',
			(ex, translation) => {
				ex
					? reject(ex)
					: resolve(
							translation.translatedText
								.toLowerCase()
								.split(' ')
								.join('-')
					  );
			}
		);
	});
};

export default translate;
