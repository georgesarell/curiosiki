var http = require('http'),
    fileSystem = require('fs'),
    path = require('path'),
    formBody = require("body/form"),
    wikipedia = require("wikipedia-js"),
    cheerio = require('cheerio'),
    wtf = require('wtf_wikipedia'),
    _ = require("lodash");
var Promise = require('promise');

var methods = {};

methods.search = function(query) {
    return new Promise(function (fulfill, reject) {
        wtf.from_api(query, 'en', function (markup) {
            var data = wtf.parse(markup);

            var section = "<p>Nothing to see here</p>";
            var digValue = "Anything";

            if (data.type === "page") {
                section = "";
                var links = []
                data.sections[0].sentences.forEach(element => {
                    section += `<p>${element.text}</p>`;

                    links = _.concat(links, _.map(element.links, "page"));
                });

                var digIndex = Math.floor((Math.random() * links.length + 1)) - 1;

                digValue = links[digIndex];

                console.log(`${JSON.stringify(links)}\tindex:${digIndex}\tvalue:${links[digIndex]}`);
            } else {
                console.log("Didn't find a page. Got some other response.\r\n");
                reject("Didn't find a page.")
            }

            fulfill({
                content: section,
                selectedLink: digValue,
                links: links
            })
        });
    });


    return {search:search};
}


module.exports = methods;


    function promise() {
        return new Promise(function (fulfill, reject) {
            fs.readFile(filename, enc, function (err, res) {
                if (err) reject(err);
                else fulfill(res);
            });
        });
    }






//             var filePath = path.join(__dirname, 'template.html');

//             var templateContents = fileSystem.readFileSync(filePath, {
//                 encoding: "ASCII"
//             });

//             var section = "<p>Nothing to see here</p>";
//             var digValue = "Anything";

//             if (data.type === "page") {
//                 section = "";
//                 var links = []
//                 data.sections[0].sentences.forEach(element => {
//                     section += `<p>${element.text}</p>`;

//                     links = _.concat(links, _.map(element.links, "page"));
//                 });

//                 var digIndex = Math.floor((Math.random() * links.length + 1)) - 1;

//                 digValue = links[digIndex];

//                 console.log(`${JSON.stringify(links)}\tindex:${digIndex}\tvalue:${links[digIndex]}`);
//             } else {
//                 console.log("Didn't find a page. Got some other response.\r\n");
//             }

//             var responseText = templateContents;

//             responseText = responseText.replace("{{wikicontent}}", section); responseText = responseText.replace("{{searchterm}}", query); responseText = responseText.replace("{{dugterm}}", digValue);

//             res.writeHead(200, {
//                 'Content-Type': 'text/html',
//                 'Content-Length': responseText.length,
//                 'search-term': body.frmSearch != null ? body.frmSearch : "NULL"
//             });

//             res.write(responseText); res.flush(); res.end();
//         });
// }


// http.createServer(function (req, res) {
//     function send(err, body) {
//         var query = body.frmSearch != null ? body.frmSearch : "William Shatner";


//     }

//     ignoreFavicon(req, res, function () {
//         formBody(req, {}, send);
//     });

// }).listen(8080);