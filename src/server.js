var http = require('http'),
    fileSystem = require('fs'),
    path = require('path'),
    formBody = require("body/form"),
    cheerio = require('cheerio'),
    wtf = require('wtf_wikipedia'),
    _ = require("lodash");

const express = require('express')
const app = express()


app.set('view engine', 'pug')

app.get('/', (req, res) => res.send('Hello World!'))

app.use(express.static('img'));

app.listen(3000, () => console.log('Example app listening on port 3000!'))


http.createServer(function (req, res) {
    function send(err, body) {
        var query = body.frmSearch != null ? body.frmSearch : "William Shatner";

        var wikipedia = require('./wikipedia');
        wikipedia.search(query).then(function (pageData) {

            var filePath = path.join(__dirname, 'template.html');

            var templateContents = fileSystem.readFileSync(filePath, {
                encoding: "ASCII"
            });

            var section = pageData.content;
            var links = pageData.links;
            var digValue = pageData.selectedLink;
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
            res.flush();
            res.end();

        });
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

function writeNoFavicon(r) {
    r.writeHead(200, {
        'Content-Type': 'image/x-icon'
    });
    r.end();
    return;
}