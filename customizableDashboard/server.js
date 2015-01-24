var express = require('express'),
    exphbs = require('express-handlebars'),
    request = require("request"),
    app = express(),
    samples = require("./sampleReports");


var hbs = exphbs.create({
    extname: ".html"
});

app.engine('.html', hbs.engine);
app.set('view engine', '.html');

app.get('/', function(req, res) {
    res.render("home", {
        pivotTable: samples.pivotTable,
        table: samples.table,
        chart: samples.chart
    });
});

app.get('/data', function(req, res, next) {
    console.log("validating data request");
    if (req.query.verificationToken !== samples.requests["chart"].options.verificationToken) {
        console.log("token invalid");
        return next(new Error("Invalid verification token."));
    }

    res.send(samples.data);
});

app.get('/widget/:name', function(req, res) {
    console.log("sending request " + JSON.stringify(samples.requests[req.params.name]));
    request({
        url: "http://localhost:4000/api/report",
        json: true,
        method: "POST",
        body: samples.requests[req.params.name],
        auth : {
            username: "admin",
            password: "password"
        }
    }).pipe(res);
});

samples.init(function() {
    app.listen(process.env.PORT || 1000);
});