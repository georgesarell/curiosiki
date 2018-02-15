var path = require('path'),
    formBody = require("body/form"),
    wtf = require('wtf_wikipedia'),
    _ = require("lodash"),
    express = require('express'),
    mustacheExpress = require('mustache-express');

var app = express()

app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '\\views');

app.get('/', function (req, res) {
    res.render('index', {
        content: null,
        searchterm: 'Curiosiki',
        digValue: null
    });
});

app.post("/", function (req, res) {

    formBody(req, {}, function (err, body) {
        var query = body.frmSearch;

        if (body.frmSearch == null || body.frmSearch === "" || body.frmSearch.toUpperCase() === "CURIOSIKI") {
            res.redirect('/about');
            return;
        }

        var wikipedia = require('./wikipedia');
        wikipedia.search(query).then(function (pageData) {

            res.render("index", _.assignIn(pageData, {
                searchterm: query
            }));

        });
    });
});

app.get('/about', function (req, res) {
    res.render('about', {
        content: null,
        searchterm: 'Curiosiki',
        digValue: null
    });
});


app.get('/blank', function (req, res) {
    res.render('index', {
        content: null,
        searchterm: 'Curiosiki',
        digValue: null
    });
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => console.log('Example app listening on port 3000!'))