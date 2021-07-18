module.exports = (req, res) => {
    const out = 'console.log("hello world")';
    res.setHeader("content-type", "application/opensearchdescription+xml");
    res.write(out);
    res.end();
};
