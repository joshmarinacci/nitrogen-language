/*
scratch


normalize() = derive(  x:max(x,0)  y:max(y,0) )

expands to
public Bounds normalize() {
    return new Bounds(
        Math.max(this.x,0)
        Math.max(this.y,0)
        this.w,
        this.h)
}

intersect(Bounds b) {
    int nx = max(b.x,x);
    int ny = max(b.y,y);
    int nw = if(b.x2<x2) b.x2-nx else w;
    int nh = if(b.y2<y2) b.y2-ny else h;
    return this.derive(
        x:nx
        y:ny
        w:nw
        h:nh
    )
}
*/


var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files
var genJava = require('./genjava.js');
var genJS = require('./genjs.js');

// Read file contents
var data = fs.readFileSync('gfx.peg', 'utf-8');
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
var code = fs.readFileSync(codepath,'utf-8');
var ast;
 ast = parse(code);
genJava.setBaseDir(basedir);
genJS.setOutFile("test.js");
for(var c in ast) {
    genJava.genJava(ast[c]);
    genJS.generate(ast[c]);
}

