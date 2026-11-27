# Runtime setup is provided by the site owner. The public Firebase Web app configuration is in `firebase-config.js`.

This repository uses Firebase's browser SDK from Google's hosted CDN, so `npm install firebase` is not required for the existing static-site deployment. Google sign-in and Firestore still depend on the enabled Firebase providers, deployed Firestore rules, authorized domains, and the admin UID document in the Firebase project.
