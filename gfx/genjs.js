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

function finish(ast) {
    pr("module.exports = {");
    for(var c in ast) {
        pr("   " + ast[c].name + ":" + ast[c].name + ",");
    }
    
    pr("};");
}

function genClass(cls) {
    var decs = cls.classdef.declarations.filter(function(d) { return d.kind == "concrete"; });

    p("function " + cls.name + "(");
    for(var i in decs) {
        if(i==0) {
            p(decs[i].name);
        } else {
            p(", " + decs[i].name);
        }
        
    }
    pr(") {");
    for(var i in decs) {
        pr("    this."+decs[i].name+" = " + decs[i].name+";");
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
            var line = m.body[j].text;
            if(/^int\s/.exec(line)) {
                var parts = /^int\s(\w+)(.+)/.exec(line);
                line = "var " + parts[1] + " " + parts[2];
            }
            pr("        " + line+";");
        }
        
        pr("    }");
    }

    
    
    pr("    return this;");
    pr("}");
}


function genEnum(cls) {
    pr("function " + cls.name+"(){}");
}

function p(s)  { out.write(s); }
function pr(s) { out.write(s+"\n"); }

module.exports.generate = generate;
module.exports.setOutFile = setOutFile;
module.exports.finish = finish;

