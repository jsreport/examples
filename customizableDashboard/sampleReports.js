var request = require("request"),
    fs = require("fs"),
    path = require("path");


var data = module.exports.data = JSON.parse(fs.readFileSync(path.join(__dirname, "sample-reports", "data.json"), "utf8"));
var pivotTable = module.exports.pivotTable = {
    name: "pivot-table",
    content: fs.readFileSync(path.join(__dirname, "sample-reports", "pivotTable.html"), "utf8"),
    recipe: "wrapped-html",
    engine: "jsrender"
}

var table = module.exports.table = {
    name: "table",
    content: fs.readFileSync(path.join(__dirname, "sample-reports", "table.html"), "utf8"),
    recipe: "client-html",
    engine: "jsrender"
}

var chart = module.exports.chart = {
    name: "chart",
    content: fs.readFileSync(path.join(__dirname, "sample-reports", "chart.html"), "utf8"),
    script: {
        content: fs.readFileSync(path.join(__dirname, "sample-reports", "chartScript.js"), "utf8")
    },
    recipe: "wrapped-html",
    helpers: "function toJSON(data) { return JSON.stringify(data);}",
    engine: "jsrender"
}

var requests = module.exports.requests = {
    pivotTable: {
        template: {
        },
        options: {
            authorization: {
                grantWrite: true
            }
        },
        data: data
    },
    table: {
        template: {
        },
        options: {
            authorization: {
                grantWrite: true
            }
        }
    },
    chart: {
        template: {
        },
        options: {
            verificationToken: "a-unique-token",
            authorization: {
                grantWrite: true
            }
        }
    }
}

function createTemplate(template, cb) {
    request({
        url: "http://localhost:4000/odata/templates",
        auth : {
            username: "admin",
            password: "password"
        },
        json: true,
        method: "POST",
        body: template
    }, function(error, response, body) {
        if (error) {
            console.log("jsreport needs to be running on the http://localhost:4000");
            process.exit();
        }

        template.shortid = body.d.shortid;
        console.log("created sample " + template.name);
        cb();
    });
}


module.exports.init = function(cb) {
    createTemplate(pivotTable, function() {
        requests.pivotTable.template.shortid = pivotTable.shortid;
        createTemplate(table, function() {
            requests.table.template.shortid = table.shortid;
            createTemplate(chart, function() {
                requests.chart.template.shortid = chart.shortid;
                cb();
            });
        });
    })
};