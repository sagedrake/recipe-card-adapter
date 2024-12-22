import puppeteer from "puppeteer";
import "dotenv/config";

export const INSTAGRAM_URL = "https://www.instagram.com/";
const INSTAGRAM_LOGIN_URL = "https://www.instagram.com/accounts/login/";
const SCREEN_WIDTH = 1080;
const SCREEN_HEIGHT = 1024;

let browser;

// connect to instagram using puppeteer and return page
// used to test whether instagram can be connected to
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

// login to instagram on the provided page
// code taken and modified from Grant Miller's answer on https://stackoverflow.com/questions/52977128/puppeteer-login-to-instagram
async function loginToInstagram(page) {
	try {
		await page.goto(INSTAGRAM_LOGIN_URL, {
			waitUntil: "networkidle0",
		});

		// Wait for log in form
		await Promise.all([
			page.waitForSelector('[name="username"]'),
			page.waitForSelector('[name="password"]'),
			page.waitForSelector('[type="submit"]'),
		]);

		// username and password are stored in .env file
		await page.type('[name="username"]', process.env.INSTAGRAM_USERNAME);
		await page.type('[name="password"]', process.env.INSTAGRAM_PASSWORD);

		// Submit log in credentials
		// If login info is wrong, the page won't go to a new url and waitForNavigation will time out
		await Promise.all([
			page.click('[type="submit"]'),
			page.waitForNavigation({
				timeout: 10000,
			}),
		]);

		return Promise.resolve();
	} catch (e) {
		return Promise.reject(`Unexpected error when logging in to Instagram: ${e}`);
	}
}

// navigate to the user's saved posts
export async function getSavedPosts(page) {
	try {
		const savedPostsURL = `${INSTAGRAM_URL}${process.env.INSTAGRAM_USERNAME}/saved`;
		await loginToInstagram(page);
		await page.goto(savedPostsURL, {
			waitUntil: "networkidle0",
		});

		if (page.url() !== savedPostsURL) {
			// if user is not signed in successfully, request to saved posts url will redirect to another url
			return Promise.reject("Cannot go to user's saved posts. Login may have failed.");
		}
	} catch (e) {
		return Promise.reject(`Unexpected error when getting saved posts: ${e}`);
	}
	return Promise.resolve();
}

// return [<username>, <description>] for now (will get image too at some point)
function getPostInfo(page) {}
