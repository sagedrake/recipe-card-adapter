import puppeteer from "puppeteer";

export const INSTAGRAM_URL = "https://www.instagram.com/";
const SCREEN_WIDTH = 1080;
const SCREEN_HEIGHT = 1024;

let browser;

// connect to instagram using puppeteer and return page
// if this function fails, it's a sign that internet may be down or instagram may be down
export async function connectToInstagram() {
	try {
		browser = await puppeteer.launch();
		const page = await browser.newPage();

		await page.goto(INSTAGRAM_URL);

		await page.setViewport({ width: SCREEN_WIDTH, height: SCREEN_HEIGHT });

		return Promise.resolve(page);
	} catch (e) {
		return Promise.reject(new Error(`Unexpected error when connecting to instagram: ${e}`));
	}
}

// close browser that was connected to instagram
export async function disconnectFromInstagram() {
	try {
		if (browser) {
			await browser.close();
		}
		return Promise.resolve();
	} catch (e) {
		return Promise.reject(new Error(`Error when closing browser: ${e}`));
	}
}

// login to instagram on the provided page, which whould be on instagram.com already
function loginToInstagram(page) {}

// navigate to the user's saved posts
function enterSavedPosts(page) {}

// return [<username>, <description>] for now (will get image too at some point)
function getPostInfo(page) {}

// (async () => {
// 	// Launch the browser and open a new blank page
// 	const browser = await puppeteer.launch();
// 	const page = await browser.newPage();

// 	// Navigate the page to a URL
// 	await page.goto("https://developer.chrome.com/");

// 	// Set screen size
// 	await page.setViewport({ width: 1080, height: 1024 });

// 	// Type into search box
// 	await page.type(".devsite-search-field", "automate beyond recorder");

// 	// Wait and click on first result
// 	const searchResultSelector = ".devsite-result-item-link";
// 	await page.waitForSelector(searchResultSelector);
// 	await page.click(searchResultSelector);

// 	// Locate the full title with a unique string
// 	const textSelector = await page.waitForSelector("text/Customize and automate");
// 	const fullTitle = await textSelector?.evaluate((el) => el.textContent);

// 	// Print the full title
// 	console.log('The title of this blog post is "%s".', fullTitle);

// 	await browser.close();
// })();
