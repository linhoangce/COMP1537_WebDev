const express = require("express");
const app = express();
app.use(express.json());
const fs = require("fs");



app.use("/js", express.static("./public/js"));
app.use("/css", express.static("./public/css"));
app.use("/images", express.static("./public/images"));


app.get("/", function(req, res) {
    let doc = fs.readFileSync("./app/html/index.html", "utf8");

    // send the text stream
    res.send(doc);
});




app.get("/table-async", function (req, res) {
   
    const mysql = require("mysql2");
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "assignment6"
    });

    let myResults = null;
    connection.connect();

    let usr = "jmdewolf";
    let usr1 = "linhoance";
    let pwd = "dewolf0410";
    let pwd1 = "oanghinhl";
    connection.execute (
        "SELECT * FROM a01401943_user WHERE a01401943_user.user_name = ? AND a01401943_user.password = ?",
        [usr, pwd],
        // "SELECT * FROM a01401943_user WHERE a01401943_user.user_name = ? AND a01401943_user.password = ?",
        // [usr1, pwd1],
        function (error, results, fields) {
            // results is an array of records, in JSON format
            // fields contains extra meta data about results
            console.log("Results: ", results);


            myResults = results;
            if (error) {


                console.log(error);
            }
            // Retrieve the data and display it as an HTML table
            let table = "<table><tr><th>ID</th><th>Username</th><th>First Name</th><th>Last Name</th><th>Email</th>";
            for (let i = 0; i < results.length; i++) {
                table += "<tr><td>" + results[i].ID + "</td><td>" + results[i].user_name + "</td><td>" + results[i].first_name + "</td><td>" 
                + results[i].last_name + "</td><td>" + results[i].email + "</td></tr>"
                // table += "<tr><td>" + results[i].ID + "</td><td>" + results[i].user_name + "</td><td>" + results[i].first_name + "</td><td>"
                // + results[i].last_name + "</td><td>" + results[i].email + "</td></tr>"
            }

            table += "</table";
            res.send(table);
            connection.end();

        }
    );

    console.log("myResults ", myResults);
});

app.get("/table-join", function (req, res) {

    const mysql = require("mysql2");
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "assignment6"
    });

    let myResults = null;
    connection.connect();

    let usr = "jmdewolf";
    connection.execute(
        "SELECT a01401943_user_timeline.ID, a01401943_user_timeline.user_id, a01401943_user_timeline.date, a01401943_user_timeline.comment, a01401943_user_timeline.time, a01401943_user_timeline.views FROM a01401943_user_timeline INNER JOIN a01401943_user ON a01401943_user_timeline.user_id AND a01401943_user.user_name = ?",
        [usr],
        function (error, results, fields) {
            // results is an array of records, in JSON format
            // fields contains extra meta data about results
            console.log("results: ", results);
            if (error) {


                console.log(error);
            }

            let table = "<table><tr><th>ID</th><th>User ID</th><th>Date</th><th>Thoughts</th><th>Time</th><th>Views</th>";
            for (let i = 0; i < results.length; i++) {
                table += "<tr>"
                for (const property in results[i]) {
                    table += "<td>" + results[i][property] + "</td>";
                } 
                table += "</tr>"
            }

            table += "</table>";
            res.send(table);
            connection.end();
        }
    );
});

/*
 *  Acceptint query strings
 */
app.get("/table-async", function (req, res) {
    connectToMySQL(res);
});

async function connectToMySQL(res) {
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "assignment6",
        mutilpleStatements: true
    });

    connection.connect();

    let usr = "jmdewolf";
    let pwd = "dewolf0410";
    const [rows, fields] = await connection.execute("SELECT * FROM a01401943_user WHERE a01401943_user.user_name = ? AND a01401943_user.password = ?", [usr, pwd]);
    let table = "<table><tr><th>ID</th><th>First Name</th><th>Last Name</th><th>Email</th></tr>";
    for (let i = 0; i < rows.length; i++) {
        table += "<tr><td>" + rows[i].ID + "</td><td>" + rows[i].first_name + "</td><td>" + rows[i].last_name + "</td><td>" + rows[i].email + "</td></tr>";
    }

    console.log("rows ", rows);

    table += "<table>";
    await connection.end();
    res.send(table);
}

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

let port = 8000;
app.listen(port, function() {
    console.log("Listening on port " + port + "~~~~~~~~~~~~");
});