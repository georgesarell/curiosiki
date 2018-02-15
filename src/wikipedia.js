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

methods.search = function (query) {
    return new Promise(function (fulfill, reject) {
        wtf.from_api(query, 'en', function (markup) {
            var data = wtf.parse(markup);

            var digValue = "";

            if (data.type === "page") {
                var links = []

                data.sections[0].sentences.forEach(element => {
                    console.log("Sentence: " + element.text);

                    links = _.concat(links, _.map(element.links, "page"));
                });

                var digIndex = Math.floor((Math.random() * links.length + 1)) - 1;

                digValue = links[digIndex];

            } else {
                console.log("Didn't find a page. Got some other response.\r\n");
                reject("Didn't find a page.")
            }

            fulfill({
                content: data.sections[0].sentences,
                selectedLink: digValue,
                links: links
            })
        });
    });
}


module.exports = methods;