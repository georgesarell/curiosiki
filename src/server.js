var http = require('http'),
    fileSystem = require('fs'),
    path = require('path'),
    formBody = require("body/form"),
    wikipedia = require("wikipedia-js"),
    cheerio = require('cheerio'),
    wtf = require('wtf_wikipedia'),
    _ = require("lodash");


http.createServer(function (req, res) {
    function send(err, body) {
        var query = body.frmSearch != null ? body.frmSearch : "William Shatner";

        wtf.from_api(query, 'en', function (markup) {
            var data = wtf.parse(markup);

            var filePath = path.join(__dirname, 'template.html');

            var templateContents = fileSystem.readFileSync(filePath, {
                encoding: "ASCII"
            });

            var section = "<p>Nothing to see here</p>";
            var digValue = "Anything";

            if (data.type === "page") {
                console.log("Found PAGE\r\n")
                section = "";
                var links = []
                data.sections[0].sentences.forEach(element => {
                    section += `<p>${element.text}</p>`;

                    links = _.concat(links, _.map(element.links, "page"));
                });

                var digIndex = Math.floor((Math.random() * links.length + 1))-1;

                digValue = links[digIndex];

                console.log(`${JSON.stringify(links)}\tindex:${digIndex}\tvalue:${links[digIndex]}`);
            }

            var responseText = templateContents;
            responseText = responseText.replace("{{wikicontent}}", section);
            responseText = responseText.replace("{{searchterm}}", query);
            responseText = responseText.replace("{{dugterm}}", digValue);

            res.writeHead(200, {
                'Content-Type': 'text/html',
                'Content-Length': responseText.length,
                'search-term': body.frmSearch != null ? body.frmSearch : "NULL"
            });

            res.write(responseText);
        });

        // wikipedia.searchArticle(options, function (wikiError, htmlWikiText) {
        //     if (wikiError) {
        //         console.log("An error occurred[query=%s, error=%s]", query, wikiError);
        //         return;
        //     }
        //     console.log("Query successful[query=%s, html-formatted-wiki-text=%s]\r\n", query, htmlWikiText);
        // });
    }

    ignoreFavicon(req, res, function () {
        formBody(req, {}, send);
    });

}).listen(8080);

function ignoreFavicon(req, res, next) {
    if (req.url === '/favicon.ico') {
        writeNoFavicon(res);
    } else {
        next();
    }
}

function writeNoFavicon(r){
    r.writeHead(200, {'Content-Type': 'image/x-icon'} );
    r.end();
    console.log('favicon requested');
    return;
}