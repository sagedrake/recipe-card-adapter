// tests for downloading saved posts from instagram

// test that instagram can be connected to
// test that account can be signed in to
// test that we can get to saved posts
// test that correct post information gets downloaded
// test usage of AI tools for getting recipe title, ingredients, and instructions

import { expect } from "chai";
import "dotenv/config";
import {
	connectToInstagram,
	disconnectFromInstagram,
	getSavedPosts,
	INSTAGRAM_URL,
} from "../../src/adapters/instagram-download.js";

describe("Instagram", function () {
	it("Should successfully connect to instagram site", async function () {
		try {
			let page = await connectToInstagram();
			const url = page.url();
			expect(url).to.equal(INSTAGRAM_URL);
			await disconnectFromInstagram();
		} catch (e) {
			expect.fail(e);
		}
	});

	it("Should be able to get saved posts", async function () {
		try {
			let page = await connectToInstagram();
			await getSavedPosts(page);
			await disconnectFromInstagram();
		} catch (e) {
			expect.fail(e);
		}
	});

	it("Save credentials", async function () {
		console.log(process.env.INSTAGRAM_USERNAME);
		console.log(process.env.INSTAGRAM_PASSWORD);
	});
});
