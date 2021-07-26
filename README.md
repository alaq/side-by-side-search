# Side-by-side search

## What is this?

Compare two search engines side-by-side. You can even add it to your browser and you'll get autocompletion!

## Usage

Start [here](https://side-by-side-search.vercel.app/).

## FAQ

### 🤷‍♂️ Why did you make this?

I've always wanted to de-google my life, but had FOMO whenever I switched to another search engine. With DuckDuckGo, I would end up using !g at all times. A good way to start using a different search engine is to have Google's results side-by-side. It eases the transition, as one learns to trust the results.

### 👀 Are you tracking the search queries?

There is absolutely no tracking. Feel free to peruse through the code for both the extension and this site in this repository.

### 🕵️‍♂️ Why do I need an extension to make this work?

Search engines do not let you display their search results in frames. They set X-Frame-Options which tell your browser to not display the page. The extension strips the header to display the page in the frame.

### 🤖 How do I make this my default search engine on Chrome?

-   Go to chrome://settings/searchEngines (copy-paste it).
-   Find "Side-by-side Search", click on the three dots and select "Make default".

### 🔥 How do I make this my default search engine on Firefox?

-   Right click in the address bar and select "Add Side-by-side Search".
-   Go to about:preferences#search (copy-paste it) and under "Default Search Engine", select "Side-by-side Search".

### ✋ Are there any known limitations?

Some other extensions may interfere with Side-by-side Search. For instance, PrivacyBadger will block google.com if it's in a frame, as it thinks it's a tracker. You may need to whitelist google.com for this to work.

### 🐞 What if I found a bug or have a feature request?

Feel free to open [an issue](https://github.com/alaq/side-by-side-search/issues/new).

## Develop

-   Clone the repository
-   Build the frontend
    -   In the `frontend/` directory, run `npm i`
    -   then build the CSS with `npm run build`
-   Load the unpacked extension
    -   For Chrome
        -   Open the Extension Management page by navigating to chrome://extensions.
        -   Enable Developer Mode by clicking the toggle switch next to Developer mode.
        -   Click the Load unpacked button and select the extension directory.
    -   Firefox
        -   Open the about:debugging page, click "This Firefox"
        -   click "Load Temporary Add-on"
        -   then select any file in the `extension/` directory.
