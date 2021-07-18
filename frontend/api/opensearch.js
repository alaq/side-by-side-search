module.exports = (req, res) => {
    res.setHeader("content-type", "application/opensearchdescription+xml");
    res.write(createXMLString(req.query.left || "Brave", req.query.right || "Google"));
    res.end();
};

const suggestionMap = {
    Brave: "https://search.brave.com/api/suggest?q={searchTerms}",
    Google: "https://search.brave.com/api/suggest?q={searchTerms}",
    DuckDuckGo: "https://search.brave.com/api/suggest?q={searchTerms}",
    Startpage: "https://search.brave.com/api/suggest?q={searchTerms}",
};

function createXMLString(left, right) {
    return `<?xml version="1.0" encoding="UTF-8"?>
    <OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
    <ShortName>Side-by-side Search</ShortName>
    <Description>Side-by-side comparison of your favorite search engines</Description>
    <InputEncoding>UTF-8</InputEncoding>
    <Image height="16" width="16">https://side-by-side-search.vercel.app/images/icon64.png</Image>
    <Url type="text/html" method="GET" template="https://side-by-side-search.vercel.app/search.html?q={searchTerm}&left=Brave&right=Google"/>
    <Url type="application/x-suggestions+json" method="GET" template="https://search.brave.com/api/suggest?q={searchTerms}"/>
    </OpenSearchDescription>`;
}
