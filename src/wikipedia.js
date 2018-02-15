var wtf = require('wtf_wikipedia'),
    _ = require("lodash");
var Promise = require('promise');

var methods = {};

methods.search = function (query) {
    return new Promise(function (fulfill, reject) {
        wtf.from_api(query, 'en', function (markup) {
            var data = wtf.parse(markup);

            var digValue = "";

            var links = []
            var sentences = [];

            if (data.type === "page") {

                console.log("Number of sections: " + data.sections.length);
                console.log(JSON.stringify(data));

                data.sections.forEach(function (section) {

                    console.log("Section title: " + section.title);

                    section.sentences.forEach(function (sentence) {

                        console.log("Sentence: " + sentence.text);

                        if (sentence.text != null && sentence.text != "") {
                            sentences.push(sentence);
                        } else {
                            console.log("Sentence is null");
                        }

                        links = _.concat(links, _.map(sentence.links, "page"));
                    });

                    if (sentences.length > 0) {
                        return false;
                    } else {
                        console.log("Empty section found. Moving to next section.");
                    }
                });;

                var digIndex = Math.floor((Math.random() * links.length + 1)) - 1;

                digValue = links[digIndex];

            } else {
                console.log("Didn't find a page. Got some other response.\r\n");
                reject("Didn't find a page.")
            }

            fulfill({
                content: sentences,
                selectedLink: digValue,
                links: links
            })
        });
    });
}


module.exports = methods;