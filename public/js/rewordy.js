function Rewordy(){}

Rewordy.prototype = {
    examples: [
        'I think I deserve a raise',
        'You look very pretty today',
        'I really need your help',
        "That's a great idea",
        'Our vacation was totally amazing',
        'Dinner was so good'
    ],

    init: function() {
        var count = 0;
        app.prepareCache();
        app.setPlaceholder(count);
        setInterval(function() {
            count++;
            if (count == app.examples.length) count = 0;
            app.setPlaceholder(count);
        }, 2500);
        app.getWords().addEventListener('keyup', app.keyPressed);
        setInterval(app.lookUpWords, 250);
        setInterval(app.updateView, 375);
    },

    prepareCache: function() {
        // When you add a word to the pre-cache, make sure it's lowercase.
        var preCache = ['a', 'an', 'but', 'i', 'is', 'it', 'me', 'that', 'the', 'this', 'was', 'you', 'your'];
        for (var i = 0; i < preCache.length; i++) {
            app.cache[preCache[i]] = app.createSelect(preCache[i]);
        }
    },

    setPlaceholder: function(index) {
        app.getWords().placeholder = app.examples[index];
    },

    getWords: function() {
        return document.getElementById('words');
    },

    keyPressed: function(event) {
        if (app.typingTimeoutId) {
            clearTimeout(app.typingTimeoutId);
            app.typingTimeoutId = null;
        }
        if (event.keyCode == 32) {
            app.parseInput();
        }
        app.typingTimeoutId = setTimeout(function() {
            app.parseInput();
        }, 312);
    },

    parseInput: function() {
        var words = app.getWords().value.split(' ');
        for (var i = 0; i < words.length; i++) {
            var word = words[i].toLowerCase();
            word = app.stripPunctuation(word);
            var shouldQueue = word.length > 1 && !app.cache[word];
            if (shouldQueue) {
                for (var j = 0; j < app.queue.length; j++) {
                    if (word === app.queue[j]) {
                        shouldQueue = false;
                        break;
                    }
                }
            }
            if (shouldQueue) {
                app.queue.push(word);
            }
        }
    },

    stripPunctuation: function(word) {
        return word.replace(/[`~!@#$%\^&*\(\)_=\+\[\]\{\}\|;:",\.\/\<\>\?]/, '');
    },

    queue: [],

    searching: false,

    cache: {},

    synonyms: {},

    visibleWords: [],

    fixedEncodeURIComponent: function(str) {
        return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
            return '%' + c.charCodeAt(0).toString(16);
        });
    },

    lookUpWords: function() {
        if (!app.searching && app.queue.length > 0) {
            app.searching = true;
            var rawWord = app.queue[0];
            var select = app.createSelect(rawWord);
            app.cache[app.queue.shift()] = select; // Move it from queue directly to cache so it won't get queued again.
            var word = app.fixedEncodeURIComponent(rawWord);
            var request = new XMLHttpRequest();
            request.open('GET', '/find/' + word, true);
            request.onload = function() {
                if (request.status >= 200 && request.status < 400) {
                    console.log(request.responseText);
                    var result = JSON.parse(request.responseText);
                    if (result.synonyms && result.synonyms.length) {
                        for (var i = 0; i < result.synonyms.length; i++) {
                            select.appendChild(app.createOption(result.synonyms[i]));
                        }
                    }
                    app.searching = false;
                }
            };
            request.send();
        }
    },

    createSelect: function(word) {
        var select = document.createElement('select');
        select.appendChild(app.createOption(word));
        return select;
    },

    createOption: function(word) {
        var option = document.createElement('option');
        option.value = word;
        option.text = word;
        return option;
    },

    updateView: function() {
        var typedWords = app.getWords().value.split(' ');
        for (var i = 0; i < typedWords.length; i++) {
            var word = typedWords[i].toLowerCase();
            word = app.stripPunctuation(word);
            var id = 'word' + i;
            var div = document.getElementById(id);
            if (!app.visibleWords[i] || app.visibleWords[i] !== word || (div !== null && div.firstChild === null)) {
                // Create the container div, if necessary.
                if (!div) {
                    div = document.createElement('div');
                    div.id = id;
                    div.className = 'choice';
                    document.getElementById('selects').appendChild(div);
                } else {
                    // Remove the existing <select> from the div, if necessary.
                    var oldSelect = div.firstChild;
                    if (oldSelect) {
                        div.removeChild(oldSelect);
                    }
                }
                if (!app.cache[word]) {
                    continue;
                }
                app.visibleWords[i] = word;
                div.appendChild(app.cache[word].cloneNode(true));
            } else {
                if (div) {
                    var existingSelect = div.firstChild;
                    if (existingSelect && existingSelect.children.length < app.cache[word].children.length) {
                        div.removeChild(existingSelect);
                        div.appendChild(app.cache[word].cloneNode(true));
                    }
                }
            }
        }
        if (app.visibleWords.length > typedWords.length) {
            for (var j = typedWords.length; j < app.visibleWords.length; j++) {
                var staleDiv = document.getElementById('word' + j);
                if (staleDiv) {
                    var staleSelect = staleDiv.firstChild;
                    if (staleSelect) {
                        staleDiv.removeChild(staleSelect);
                    }
                }
            }
        }
    }
};

var app = new Rewordy();
app.init();
