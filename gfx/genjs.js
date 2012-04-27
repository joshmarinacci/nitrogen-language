var fs = require('fs');

var out;
function setOutFile(file) {
    console.log('writing to ' + file);
    out = fs.createWriteStream(file, {flags:'w',encoding:'utf-8',mode:0666});
    pr("//generated code. do not modify");
}

function generate(cls) {
    if(cls.classtype == "value") {
        genClass(cls);
    }
    if(cls.classtype == "enum") {
        genEnum(cls);
    }
    out.flush();
}

function genClass(cls) {
    pr("function " + cls.name + "() {");
    var decs = cls.classdef.declarations.filter(function(d) { return d.kind == "concrete"; });
    for(var i in decs) {
        pr("    this."+decs[i].name+" = " + decs[i].defaultvalue+";");
    }
    
    var syndecs = cls.classdef.declarations.filter(function(d) {
        return d.kind == "synthetic";
    });
    for(var i in syndecs) {
        pr("    this.get"+syndecs[i].name+" = function() {");
        pr("        return " + syndecs[i].expression.join("")+";");
        pr("    }");
    }
    
    
    var meths = cls.classdef.methods;
    for(var i in meths) {
        var m = meths[i];
        p("    this."+m.name+" = function(");
        for(var j in m.params) {
            if(j!=0) p(", ");
            p(m.params[j].id);
        }
        pr("){");
        for(var j in m.body) {
            pr("        " + m.body[j].text+";");
        }
        
        pr("    }");
    }

    
    
    pr("    return this;");
    pr("}");
}


function genEnum(cls) {
}

function p(s)  { out.write(s); }
function pr(s) { out.write(s+"\n"); }

module.exports.generate = generate;
module.exports.setOutFile = setOutFile;

