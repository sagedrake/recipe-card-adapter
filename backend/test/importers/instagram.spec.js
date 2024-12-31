import { expect } from "chai";
import "dotenv/config";
import {
	connectToInstagram,
	disconnectFromInstagram,
	getSavedPosts,
	INSTAGRAM_URL,
} from "../../src/importers/instagram.js";

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

	it("Should retrieve from test collection with one post", async function () {
		try {
			let page = await connectToInstagram();

			const extractedPosts = await getSavedPosts(page, "Test - One Post");
			expect(extractedPosts.length).to.equal(1);
			const firstPost = extractedPosts[0];

			expect(firstPost.url).to.equal("https://www.instagram.com/p/C1trR4gLHBb/");
			expect(firstPost.username).to.equal("gigi_goes_vegan");
			expect(firstPost.imageURL.startsWith("https://instagram.fyto1-2.fna.fbcdn.net"));
			expect(
				firstPost.description.startsWith(
					"TOFU FLATBREAD \n\nHigh Protein Veganuary episode 5:"
				)
			);

			await disconnectFromInstagram();
		} catch (e) {
			expect.fail(e);
		}
	});

	it("Should retrieve from test collection with multiple posts", async function () {
		try {
			let page = await connectToInstagram();

			const extractedPosts = await getSavedPosts(page, "Test - Multiple Posts");
			expect(extractedPosts.length).to.equal(4);

			const firstPost = extractedPosts[0];
			expect(firstPost.url).to.equal("https://www.instagram.com/p/C99_BZHJwjG/");
			expect(firstPost.username).to.equal("rainbowplantlife");

			const lastPost = extractedPosts[3];
			expect(lastPost.url).to.equal("https://www.instagram.com/p/C732X4sPtmt/");
			expect(lastPost.imageURL.startsWith("https://instagram.fyto1-2.fna.fbcdn.net"));
			expect(
				lastPost.description.startsWith(
					"These almond croissant cookie bars taste like the classic pastry"
				)
			);

			await disconnectFromInstagram();
		} catch (e) {
			expect.fail(e);
		}
	});
});
