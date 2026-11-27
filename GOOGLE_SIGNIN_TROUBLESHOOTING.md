# Diagnosing Google sign-in failures

The sign-in flow now attempts a popup first and automatically falls back to a full-page Google redirect when the browser blocks/closes the popup. It displays the specific Firebase error code rather than a generic message.

If the message is `auth/unauthorized-domain`, copy the exact hostname shown in the error (without `https://` or a path) and add it in Firebase Console → Authentication → Settings → Authorized domains. For GitHub Pages this is commonly `prizefordice.github.io`; for a custom domain add that exact domain too. If the code is `auth/operation-not-allowed`, enable Google in Authentication → Sign-in method. The app code cannot enable these project-level settings itself.

Use the exact deployed website hostname; `localhost` is for local development. After changing Firebase settings, reload the community page and try again.
