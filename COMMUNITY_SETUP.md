# PRIZE FOR DICE community feature setup

The repository is a static website. Google login, persistent member posts and secure developer-only news publishing require a Firebase project owned by the site operator; these external credentials cannot be created by a GitHub file commit.

1. Create a Firebase project and register a Web app.
2. Enable Google under Authentication → Sign-in method. Add the deployed site domain under authorized domains.
3. Create a Cloud Firestore database.
4. Copy the Firebase Web app config into `firebase-config.js`. These are public client identifiers; never put service-account keys or private secrets in the browser.
5. Publish `firestore.rules` in Firestore → Rules.
6. Serve the site over HTTPS or localhost (ES modules do not run from `file://`). Open `community.html`, sign in with the developer's Google account, then copy that account's UID from Authentication → Users.
7. In Firestore Console create document `admins/{UID}` with the user's UID as document ID. The rules prohibit client writes to the admins collection; only a project owner can provision a developer.

All signed-in users can create public community posts and delete their own posts. Only admin UIDs can create, edit, or delete news. The site hides the admin form for other users, and Firestore Rules enforce the permission independently. Check current privacy obligations and obtain appropriate consent before enabling a public community.
