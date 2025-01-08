# Recipe Card Adaptor

## Project Goals
I originally started developing this app as a simple CRUD app for storing recipes. I did this to learn and practice using React and SQL.

I then decided that I wanted to improve the initial app to make something that was more useful to me. I decided to use it to solve two problems:
1. **Disorganization of recipes.** I currently find and save recipes in many places, including Instagram, Notion, recipe blogs, and physical recipes books. I would like
to create a system for transferring all of these recipes into one central app. I have hundreds of saved recipes and transferring them manually would take a long time.
2. **Reliance on a device when cooking**. This creates problems like getting food on the screen, and having my phone/computer go to sleep. 
I would like to automate generation of printable recipe cards so that I can print physical copies of my favourite recipes. 


## Current State of the App

I've created the central app for adding, updating, and viewing recipes. The backend uses Node.js and MySQL, and the frontend uses React.

I wrote a script to download saved recipe posts from Instagram using Puppeteer. The script logs in to a given account, finds a saved posts
folder with a given name, and extracts information from all the posts in that folder (including the URL, post caption, cover image URL, and account name).
I also have tests for this script which are written using Mocha and Chai.
