import puppeteer from "puppeteer";
import "dotenv/config";

export const INSTAGRAM_URL = "https://www.instagram.com";
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

		console.log("Connecting to Instagram.");
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
			console.log("Closing browser connection.");
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
		console.log("Navigating to login page.");
		await page.goto(INSTAGRAM_LOGIN_URL, {
			waitUntil: "networkidle0",
		});

		// Wait for login form
		await Promise.all([
			page.waitForSelector('[name="username"]'),
			page.waitForSelector('[name="password"]'),
			page.waitForSelector('[type="submit"]'),
		]);

		console.log("Entering username and password.");
		// username and password are stored in .env file
		await page.type('[name="username"]', process.env.INSTAGRAM_USERNAME);
		await page.type('[name="password"]', process.env.INSTAGRAM_PASSWORD);

		// Submit log in credentials
		// If login info is wrong, the page won't go to a new url and waitForNavigation will time out
		console.log("Logging in");
		await Promise.all([
			page.click('[type="submit"]'),
			page.waitForNavigation({
				timeout: 20000,
			}),
		]);

		return Promise.resolve();
	} catch (e) {
		return Promise.reject(`Unexpected error when logging in to Instagram: ${e}`);
	}
}

async function goToCollection(page, collectionName) {
	const savedPostsURL = `${INSTAGRAM_URL}/${process.env.INSTAGRAM_USERNAME}/saved`;
	try {
		console.log("Navigating to saved posts page.");
		await page.goto(savedPostsURL, {
			waitUntil: "networkidle0",
		});

		if (page.url() !== savedPostsURL) {
			// if user is not signed in successfully, request to saved posts url will redirect to another url
			return Promise.reject("Cannot go to user's saved posts. Login may have failed.");
		}

		// find collection with correct title, click to open it, and wait for url to change
		console.log(`Finding collection with name: ${collectionName}.`);
		await Promise.all([
			page
				.locator(`[aria-label='Saved collections'] a[aria-label='${collectionName}']`)
				.click(),
			page.waitForNavigation({ timeout: 10000, waitUntil: "networkidle0" }),
		]);
	} catch (e) {
		return Promise.reject(e);
	}
	return Promise.resolve();
}

// return list of saved Instagram posts in the collection with the given name
// each post object will have the properties: username, url, imageURL, description
export async function getSavedPosts(page, collectionName) {
	let posts = [];
	try {
		await loginToInstagram(page);
		await goToCollection(page, collectionName);

		// wait until posts in collection have loaded
		console.log("Waiting until posts in collection have loaded.");
		await page.waitForSelector("a:has(._aagu)");

		console.log("Getting links to all posts in the collection.");
		// query to find links to posts in the collection
		posts = await page.$$eval("a:has(._aagu)", (links) =>
			// once elements are found, extract the relevant post information from them (URL of post, URL of cover image, and post description)
			links.map((link) => {
				const postURL = link.getAttribute("href");
				const coverImage = link.firstChild.firstChild.firstChild;
				const coverImageURL = coverImage.getAttribute("src");
				const postDescription = coverImage.getAttribute("alt");
				return {
					url: postURL,
					imageURL: coverImageURL,
					description: postDescription,
				};
			})
		);

		// Usernames are retrieved one at a time for each post to avoid getting my account banned for bot-like activity
		for (const post of posts) {
			// each url initially looks like "/p/C1DS1Ulr7sk/", but the full URL is like https://www.instagram.com/p/C1DS1Ulr7sk/
			post.url = INSTAGRAM_URL + post.url;
			console.log(`Getting username for post with url: ${post.url}.`);
			post.username = await getUsernameFromPost(page, post.url);
		}
	} catch (e) {
		return Promise.reject(`Unexpected error when getting saved posts: ${e}`);
	}
	return Promise.resolve(posts);
}

// async function to get username from post URL
// page needs to already be signed in to instagram in order for this to work
async function getUsernameFromPost(page, url) {
	let username = "";
	try {
		await page.goto(url, {
			waitUntil: "networkidle0",
		});
		const element = await page.waitForSelector("span.xt0psk2 > div > a");
		username = await element.evaluate((el) => el.textContent);
	} catch (e) {
		return Promise.reject(new Error(`Unexpected error when retrieving post username: ${e}`));
	}
	return Promise.resolve(username);
}
