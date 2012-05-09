var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files
var genJava = require('./genjava.js');
var genJS = require('./genjs.js');


// Read file contents
var data = fs.readFileSync(__dirname+'/gfx.peg', 'utf-8');
// Show the PEG grammar file
//console.log(data);
// Create my parser
var parse = PEG.buildParser(data).parse;

// Do a test

//console.log(parse("value Bounds { int x = 0; }"));
//console.log(parse("value Bounds { int x = 0; int y = 0; }"));
//console.log(parse("value Bounds"));
//assert.deepEqual( parse("value Bounds { int x = 0; }"), ["a", "b", "c"] );

var codepath = process.argv[2];
console.log("reading code = " + codepath);
var basedir =  process.argv[3];
var jsfile = process.argv[4];
var code = fs.readFileSync(codepath,'utf-8');
var ast;
 ast = parse(code);
genJava.setBaseDir(basedir);
genJS.setOutFile(jsfile);
for(var c in ast) {
    genJava.genJava(ast[c]);
    genJS.generate(ast[c]);
}

genJS.finish(ast);

