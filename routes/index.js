var express = require('express');
var router = express.Router();
var http = require('http');
var parseString = require('xml2js').parseString;

router.get('/', function(req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/find/:word',  function(req, res, next) {
    var xml = '';
    var rawSynonyms = [];
    var rawRelated = [];
    var result = {synonyms: []};
    var options = {
        host: 'www.dictionaryapi.com',
        path: '/api/v1/references/thesaurus/xml/'+req.params.word+'?key=452859c8-b965-4a3a-a5bc-931cbb2a66d7'
    };
    var request = http.request(options, function(response) {
        response.setEncoding('utf8');
        response.on('data', function(chunk) {
            xml += chunk;
        });
        response.on('end', function() {
            parseString(xml, function(error, object) {
                if (object && object.entry_list && object.entry_list.entry && object.entry_list.entry.length) {
                    for (var i = 0; i < object.entry_list.entry.length; i++) {
                        var entry = object.entry_list.entry[i];
                        // Get the synonyms
                        if (entry && entry.sens && entry.sens[0] && entry.sens[0].syn && entry.sens[0].syn[0]) {
                            if (entry.sens[0].syn[0]._) {
                                rawSynonyms = rawSynonyms.concat(entry.sens[0].syn[0]._.split(', '));
                            } else {
                                rawSynonyms = rawSynonyms.concat(entry.sens[0].syn[0].split(', '));
                            }
                        }
                        // Get the related words
                        if (rawSynonyms.length < 5 && entry && entry.sens && entry.sens[0] && entry.sens[0].rel && entry.sens[0].rel[0]) {
                            if (entry.sens[0].rel[0]._) {
                                rawSynonyms = rawSynonyms.concat(entry.sens[0].rel[0]._.split(/[,;]\s/));
                            } else {
                                rawSynonyms = rawSynonyms.concat(entry.sens[0].rel[0].split(/[,;]\s/));
                            }
                        }
                    }
                }
            });
            rawSynonyms.sort(function(a, b) {
                if (a.toLowerCase() < b.toLowerCase()) return -1;
                if (a.toLowerCase() > b.toLowerCase()) return 1;
                return 0;
            });
            var previous = null;
            for (var i = 0; i < rawSynonyms.length; i++) {
                var splitSynonyms = rawSynonyms[i].split(' []'); // Remove synonyms that end with ' []'.
                var candidate = splitSynonyms[0].toLowerCase();
                var regex = new RegExp(req.params.word); // TODO .... What about words that contain an apostrophe or other special characters?
                if (!regex.test(candidate)) { // Remove synonyms that contain the original word.
                    if (candidate === previous) { // Remove duplicates.
                        continue;
                    }
                    previous = candidate;
                    result.synonyms.push(candidate);
                }
            }
            console.log(result.synonyms);
            return res.send(result);
        });
    });
    request.on('error', function(error) {
        return res.send({error: error.message});
    });
    request.end();
});

module.exports = router;
