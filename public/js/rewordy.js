function Rewordy(){}

Rewordy.prototype = {
    examples: [
        'I think I deserve a raise.',
        'You look very pretty today.',
        'I really need your help.',
        "That's a very good idea.",
        'Our vacation was totally amazing!',
        'Dinner was so good.'
    ],

    init: function() {
        var count = 0;
        app.setPlaceholder(count);
        setInterval(function() {
            count++;
            if (count == app.examples.length) count = 0;
            app.setPlaceholder(count);
        }, 3000);
        // TODO and WYLO .... So the reason for doing it on spacebar key up is to avoid queuing de, des, dese, deser, deserv ... when looking up deserve.
        //                    Perhaps the best thing to do is only queue words on space bar up, and after typing has stopped for a given period of time
        //                    to get the final word typed (which won't have a space after it). This still doesn't address copy/paste though...
        app.getWords().addEventListener('keyup', app.keyPressed);
        setInterval(app.lookUpWords, 250);
    },

    setPlaceholder: function(index) {
        app.getWords().placeholder = app.examples[index];
    },

    getWords: function() {
        return document.getElementById('words');
    },

    keyPressed: function(event) {
        if (event.keyCode == 32) {
            app.parseInput();
        }
    },

    parseInput: function() {
        var words = event.target.value.split(' ');
        for (var i = 0; i < words.length; i++) {
            var word = words[i].toLowerCase();
            word = app.stripPunctuation(word);
            var shouldQueue = word.length > 1 && !app.exclusions[word] && !app.cache[word];
            if (shouldQueue) {
                for (var j = 0; j < app.queue.length; j++) {
                    if (word === app.queue[j]) {
                        shouldQueue = false;
                        break;
                    }
                }
            }
            if (shouldQueue) {
                console.log('queuing', word);
                app.queue.push(word);
            }
        }
    },

    stripPunctuation: function(word) {
        return word.replace(/[`~!@#$%\^&*\(\)_=\+\[\]\{\}\|;:",\.\/\<\>\?]/, '');
    },

    exclusions: {ac:1,af:1,aj:1},

    queue: [],

    searching: false,

    cache: {},

    synonyms: {},

    fixedEncodeURIComponent: function(str) {
        return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
            return '%' + c.charCodeAt(0).toString(16);
        });
    },

    lookUpWords: function() {
        if (!app.searching && app.queue.length > 0) {
            app.searching = true;
            var rawWord = app.queue[0];
            app.cache[app.queue.shift()] = []; // Move it from queue directly to cache so it won't get queued again.
            var word = app.fixedEncodeURIComponent(rawWord);
            var request = new XMLHttpRequest();
            request.open('GET', '/find/' + word, true);
            request.onload = function() {
                if (request.status >= 200 && request.status < 400) {
                    console.log(request.responseText);
                    var result = request.responseText;
                    app.cache[rawWord] = result.synonyms ? result.synonyms : [];
                    app.searching = false;
                }
            };
            request.send();
        }
        // TODO .... Update the view.
    },

    updateView: function() {
        // Loop over the words in the input to see if any need to be displayed with their synonyms...
    }
};

var app = new Rewordy();
app.init();
