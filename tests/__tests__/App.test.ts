import Page from '../helpers/page';

let page;
beforeEach(async () => {
	page = await Page.init();
});

test('The brand has the correct text', async () => {
	await page.login();
	const text = await page.getContentsOf('[data-e2e-id="brand"]');
	expect(text).toEqual('Chatty');
});

afterEach(async () => {
	await page.close();
});
