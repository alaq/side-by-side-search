module.exports = (req, res) => {
    res.setHeader("content-type", "application/opensearchdescription+xml");
    res.write(createXMLString());
    res.end();
};

function createXMLString() {
    // const parser = new DOMParser();
    // const doc = parser.parseFromString(XML_TEMPLATE, "application/xml");

    // // Search URL
    // const url = doc.querySelector('Url[type="text/html"]');
    // // url.setAttribute("template", browser.extension.getURL("search.html?q=") + "{searchTerms}");
    // url.setAttribute("template", "https://google.com/search?q={searchTerms}");
    // url.setAttribute("method", "GET");

    // const image = doc.getElementsByTagName("Image")[0];
    // image.textContent = "https://side-by-side-search.vercel.app/images/icon64.png";

    // const suggestUrl = doc.querySelector('Url[type="application/x-suggestions+json"]');
    // suggestUrl.setAttribute("method", "GET");
    // suggestUrl.setAttribute("template", "https://search.brave.com/api/suggest?q={searchTerms}");

    // // Description
    // const description = doc.getElementsByTagName("Description")[0];
    // description.textContent = "Side-by-side comparison of your favorite search engines";

    // const serialzer = new XMLSerializer();
    // const string = serialzer.serializeToString(doc);

    return `<?xml version="1.0" encoding="UTF-8"?>
    <OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
    <ShortName>Side-by-side Search</ShortName>
    <Description>Side-by-side comparison of your favorite search engines</Description>
    <InputEncoding>UTF-8</InputEncoding>
    <Image height="16" width="16">https://side-by-side-search.vercel.app/images/icon64.png</Image>
    <Url type="text/html" method="GET" template="https://google.com/search?q={searchTerms}"/>
    <Url type="application/x-suggestions+json" method="GET" template="https://search.brave.com/api/suggest?q={searchTerms}"/>
    </OpenSearchDescription>`;
}
