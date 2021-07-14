const XML_TEMPLATE = `<?xml version="1.0" encoding="utf-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
<ShortName>Side-by-side Search</ShortName>
<Description></Description>
<InputEncoding>UTF-8</InputEncoding>
<Image height="16" width="16"></Image>
<Url type="text/html" method="get" template=""></Url>
<Url type="application/x-suggestions+json" method="get" template=""></Url>
</OpenSearchDescription>`;

const onLoad = async (xmlString) => {
    // Upload the OpenSearch XML description to file.io, because AddSearchProvider
    // requires http(s) URLs. After the XML is downloaded to start the installation
    // process, the file should be automatically removed.
    try {
        let response = await fetch("https://paste.mozilla.org/api/", {
            method: "POST",
            body: new URLSearchParams({
                content: xmlString,
                format: "json",
                expires: "onetime",
                lexer: "xml",
            }),
        });

        let json = await response.json();
        // We need the raw XML instead of the pretty HTML view
        let url = json.url + "/raw";
        console.log(url);

        let link = document.createElement("link");
        link.rel = "search";
        link.type = "application/opensearchdescription+xml";
        link.title = "Side-by-side Search";
        link.href = url;

        // This doesn't actually seem to work. Firefox seems to cache.
        let existing = document.querySelector("link[rel=search]");
        if (existing) {
            existing.remove();
        }

        document.head.append(link);
    } catch (error) {
        alert(error);
    }
};

function createXMLString() {
    const parser = new DOMParser();
    const doc = parser.parseFromString(XML_TEMPLATE, "application/xml");

    // Search URL
    const url = doc.querySelector('Url[type="text/html"]');
    // url.setAttribute("template", browser.extension.getURL("search.html?q=") + "{searchTerms}");
    url.setAttribute("template", "https://google.com/search?q={searchTerms}");
    url.setAttribute("method", "GET");

    const image = doc.getElementsByTagName("Image")[0];
    image.textContent = "https://side-by-side-search.vercel.app/images/icon64.png";

    const suggestUrl = doc.querySelector('Url[type="application/x-suggestions+json"]');
    suggestUrl.setAttribute("method", "GET");
    suggestUrl.setAttribute("template", "https://search.brave.com/api/suggest?q={searchTerms}");

    // Description
    const description = doc.getElementsByTagName("Description")[0];
    description.textContent = "Side-by-side comparison of your favorite search engines";

    const serialzer = new XMLSerializer();
    const string = serialzer.serializeToString(doc);

    return string;
}

console.log(createXMLString());
// onLoad(createXMLString());
