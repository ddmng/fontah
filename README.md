# Font-ah!

Quickly prototype a text using random settings. Use it to find a font/color/size combination for a text in a single place, with a little help from... fate.

Just:
* enter the text
* use the buttons in the header to change colors, size and typeface
* copy font and color params from the footer

Supported fonts sources:
* [x] Google Fonts (downloaded locally to avoid sharing API-KEY)
* [ ] Typekit
* [ ] other sources? Issue please!

### How it's made
Made with [hyperapp](https://github.com/jorgebucaran/hyperapp), [V2 branch](https://github.com/jorgebucaran/hyperapp/pull/726).

### What's next

Here are some idea on how to improve the project:

* [x] increase/decrease font size instead of random size
* [x] use [hyperapp subscriptions](https://github.com/jorgebucaran/hyperapp/issues/752) for saving on Firebase
* [x] mobile-friendly (more or less)
* [x] share your work (url) and collaborate with a unique link (Firebase backed)
* [ ] notify page viewers
* [ ] Work without firebase backend in case ov quota expiration
* [ ] error management on effects (starting from firebase quota exceeded)
* [ ] tune firebase settings
* [ ] upvote combination
* [ ] bookmarks, w/ local storage persistence
* [ ] combinations history
* [ ] copy css
* [ ] ~~use [hyperapp subscriptions](https://github.com/jorgebucaran/hyperapp/issues/752) for media-change in JS~~
* [ ] PWA
* [ ] couchdb backend?

### How to run it locally
Clone the repo:
```sh
git clone https://github.com/ddmng/fontah.git
cd fontah/
```

File `src/fbconfig.js` contains the Firebase API key, in order to save the application state. You can find yours in your [Firebase console](https://console.firebase.google.com/).

Build it:
```sh
npm run build
```

Then serve it:
```sh
npm start
```