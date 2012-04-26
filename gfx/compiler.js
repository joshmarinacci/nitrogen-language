/*
scratch

*/


var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files

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
//console.log(basedir);

var code = fs.readFileSync(codepath,'utf-8');
console.log(code);
//var cd2 = "value Bounds { int x = 0; int y = 0; int w = 0; int h = 0; get int x2 {x+w}; }";
//console.log("code = " + cd2+"-");
var ast = parse(code);
console.log(ast);

var outfile = basedir+'microgui/Bounds.java';
var out;



function openClass(name) {
    var outfile = basedir+"microgui/"+name+".java";
    console.log("writing to: " + outfile);
    out = fs.createWriteStream(outfile, { flags:'w',encoding:'utf-8',mode:0666});
    pr("package microgui;");
}
function closeClass() {
    out.end();
}



function o(s) { console.log(s); }
function p(s) { out.write(s); }
function pr(s) { out.write(s+"\n"); }



function genJava(ast) {
    if(ast.classtype == "value") {
        openClass(ast.name);
        pr("public class " + ast.name + " {");
        
        //concrete properties
        for(var i in ast.classdef.declarations) {
            var dec = ast.classdef.declarations[i];
            if(dec.kind=="synthetic") continue;
            p("  private " + dec.type + " ");
            pr(dec.name + " = " + dec.defaultvalue + ";");
            p("  public " + dec.type + " get"+capitalize(dec.name)+"() {");
            p(" return this."+dec.name+";");
            pr(" }");
        }
        
        //constructor
        p("  public "+ast.name+"(");
        var len = ast.classdef.declarations.length;
        for(var i in ast.classdef.declarations) {
            var dec = ast.classdef.declarations[i];
            if(dec.kind=="synthetic") continue;
            if(i!=0) p(", ");
            p(dec.type +" " +dec.name);
        }
        pr(" ) {");
        for(var i in ast.classdef.declarations) {
            var dec = ast.classdef.declarations[i];
            if(dec.kind=="synthetic") continue;
            pr("    this."+dec.name+" = "+dec.name+";");
        }
        
        pr("  }");

        //synthetic props
        for(var i in ast.classdef.declarations) {
            var dec = ast.classdef.declarations[i];
            if(dec.kind!="synthetic") continue;
            p("  public "+dec.type+" get"+capitalize(dec.name)+"() {");
            p(" return " + dec.expression.join("")+";");
            pr(" }");
            
        }
        
        //methods
        for(var i in ast.classdef.methods) {
            var m = ast.classdef.methods[i];
            p("  public " + m.rettype );
            p(" "+m.name+"(");
            for(var j in m.params) {
                var param = m.params[j];
                if(j!=0) p(", ");
                p(param.type+" "+param.id);
            }
            p(")");
            pr("{");
            for(var j in m.body) {
                pr("    " + m.body[j].text+";");
            }
            pr("  }");
        }

        p("}");
        closeClass();
    }
}

function capitalize(s) {
    return s[0].toUpperCase()+s.substr(1);
}


for(var c in ast) {
    genJava(ast[c]);
}
