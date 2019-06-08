const puppeteer = require('puppeteer');

test('We can launch a browser', async () => {
	const browser = await puppeteer.launch({
		headless: false
	});
	const page = await browser.newPage();
	await page.goto('localhost:3000');
	const text = await page.$eval('[data-e2e-id="brand"]', el => el.textContent);

	expect(text).toEqual('Chatty');
});
