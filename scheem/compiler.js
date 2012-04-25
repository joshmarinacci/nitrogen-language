var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files

// Read file contents
var data = fs.readFileSync('scheem.peg', 'utf-8');
// Show the PEG grammar file
console.log(data);
// Create my parser
var parse = PEG.buildParser(data).parse;

// Do a test
assert.deepEqual( parse("(a b c)"), ["a", "b", "c"] );

// test extra spaces
assert.deepEqual( parse("(a  b c)"), ["a", "b", "c"] );
assert.deepEqual( parse("(a    b   c)"), ["a", "b", "c"] );
//space right after paren
assert.deepEqual( parse("( a b c )"), ["a", "b", "c"] );
//tabs and newlines
assert.deepEqual( parse("( a\t b\n c )"), ["a", "b", "c"] );
//nested
assert.deepEqual( parse("(a (b) c)"), ["a", ["b"], "c"] );

//quote
assert.deepEqual( parse("(quote (1 2 3))"),["quote",["1","2","3"]]);
assert.deepEqual( parse("(' (1 2 3))"),["quote",["1","2","3"]]);

//comments
assert.deepEqual( parse("((a b c)\n;;this is a comment\na)"),[["a","b","c"],"a"]);
