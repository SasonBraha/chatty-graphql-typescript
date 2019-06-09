import * as puppeteer from 'puppeteer';

class Page {
	private page: any;
	static async init() {
		const browser = await puppeteer.launch({
			headless: true
		});

		const page = await browser.newPage();
		const customPage = new Page(page);

		return new Proxy(customPage, {
			get(target, property) {
				return customPage[property] || browser[property] || page[property];
			}
		});
	}

	constructor(page) {
		this.page = page;
	}

	async login() {
		await this.page.goto('localhost:3000');
		await this.page.evaluate(() => {
			localStorage.setItem(
				'authToken',
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkaXNwbGF5TmFtZSI6IlNhc29uIiwiZW1haWwiOiJzYXNvbmJyYWhhQGdtYWlsLmNvbSIsImF2YXRhciI6Imh0dHBzOi8vYXZhdGFyczEuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMzAxNTU4NDM_cz00NjAmdj00Iiwiand0SGFuZHNoYWtlIjoiMDc4NjYyMmUtMmMxZC00ODg2LWI2ODctYjNkN2I3NDhkYzVmIiwicm9sZSI6IlVzZXIiLCJzbHVnIjoic2Fzb25AYWU4NTM4ZTMtOTJkNy00OTNlLWE1M2MtODcyMDc0ZjY4YTBmIiwiX2lkIjoiNWNiOWM0ZjljNGUwMjMwN2RjNDI1YjM4IiwiaWF0IjoxNTYwMDA5Njk2LCJleHAiOjE1NjA4NzM2OTZ9.GhXyOZGVRjOgW-4m8-9-26v6JNbsTlJKagzYfj-J5dM'
			);
		});
		await this.page.reload();
	}

	async getContentsOf(selector: string): Promise<string> {
		return this.page.$eval(selector, el => el.textContent);
	}
}

export default Page;
