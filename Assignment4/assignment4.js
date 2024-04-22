// REQUIRES
const express = require("express");
const app = express();
// constant app = require("express");
app.use(express.json());
const fs = require("fs");
const port = 8000;


app.use("/js", express.static("./public/js"));
app.use("/css", express.static("./public/css"));
app.use("/images", express.static("./public/images"));

// app.use(express.static('public'));

app.get("/", function (req, res) {
    let doc = fs.readFileSync("./app/html/index.html", "utf8");
    
    // just send the text stream
    res.send(doc);
});

// This one accepts a query string
app.get("/galleries", function(req, res) {

    let doc = fs.readFileSync("./app/data/galleries.html", "utf8");
    // let formatOfResponse = req.query.format;
    // cpmsole.log(req.query);
        res.setHeader("Content-Type", "text/html");
        
        res.send(doc);

});

app.get("/artworks", function(req, res) {

    let doc = fs.readFileSync("./app/data/artworks.js", "utf8");

    res.setHeader("Content-Type", "application/json");
    res.send(doc);
})

// for page not found (i.e 404)
app.use(function (req, res, next) {
    // tjhos could be a seperate file too - but you'd have to make sure that you have the path
    // correct, otherwise, you'd get a 404 (actually a 500 on the 404)
    res.status(404).send("<html><head><title>Page not found!</title></head><body><p>Nothing here.</p></body></html>");
});

// RUN SERVER

app.listen(port, function() {
    console.log(`Server running at http://localhost:${port}`);
})