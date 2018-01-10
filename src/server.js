var http = require('http'),
    fileSystem = require('fs'),
    path = require('path'),
    formBody = require("body/form"),
    wikipedia = require("wikipedia-js"),
    cheerio = require('cheerio');
        

http.createServer(function (req, res) {


    function send(err, body) {
        var query =  body.frmSearch != null ? body.frmSearch : "William Shatner";
        var options = {
            query: query,
            format: "html",
            summaryOnly: true
        };
        wikipedia.searchArticle(options, function (wikiError, htmlWikiText) {

            if (wikiError) {
                console.log("An error occurred[query=%s, error=%s]", query, wikiError);
                return;
            }

            console.log("Query successful[query=%s, html-formatted-wiki-text=%s]\r\n", query, htmlWikiText);


            var filePath = path.join(__dirname, 'template.html');

            var templateContents = fileSystem.readFileSync(filePath, {encoding: "ASCII"});

            console.info("Template contents: %s\r\n", templateContents);

            var $ = cheerio.load(htmlWikiText);
            
            htmlWikiText = $("p").html();

            var responseText = templateContents.replace("{{wikicontent}}", htmlWikiText);

            res.writeHead(200, {
                'Content-Type': 'text/html',
                'Content-Length': responseText.length,
                'search-term': body.frmSearch != null ? body.frmSearch : "NULL"
            });

            res.write(responseText);

        });
    }

    formBody(req, {}, send);

}).listen(8080);