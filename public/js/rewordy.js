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
            var shouldQueue = word.length > 1 && !app.exclusions[word] && !app.cache[word];
            if (shouldQueue) {
                for (var j = 0; j < app.queue.length; j++) {
                    if (word === app.queue[j]) {
                        console.log('not queuing', word);
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
            var word = app.fixedEncodeURIComponent(app.queue.shift());
            var request = new XMLHttpRequest();
            request.open('GET', '/find/' + word, true);
            request.onload = function() {
                if (request.status >= 200 && request.status < 400) {
                    var result = request.responseText;
                    console.log(result);
                    // TODO and WYLO .... Add the word and result array to the cache.
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
