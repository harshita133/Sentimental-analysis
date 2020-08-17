var test = require('tap').test;
var Sentiment = require('../../lib/index');
var sentiment = new Sentiment();

var input = 'This is so cool';
var options = {
    extras: { 'cool': 100 }
};

var result = sentiment.analyze(input, options);

test('synchronous inject', function (t) {
    t.type(result, 'object');
    t.equal(result.score, 100);
    t.equal(result.comparative, 25);
    t.equal(result.tokens.length, 4);
    t.equal(result.words.length, 1);
    t.end();
});
