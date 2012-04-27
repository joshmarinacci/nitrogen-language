var fs = require('fs'); // for loading files

var basedir = "";
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

        
        //the builder
        pr("  public static "+ast.name+".Builder getBuilder() { return new "+ast.name+".Builder(); }");
        pr("  public static class Builder {");
        for(var i in ast.classdef.declarations) {
            var dec = ast.classdef.declarations[i];
            if(dec.kind=="synthetic") continue;
            p("    private " + dec.type + " ");
                pr(dec.name + " = " + dec.defaultvalue + ";");
            pr("    public Builder set"+capitalize(dec.name)+"("+dec.type + " " + dec.name +") {");
            pr("       this."+dec.name+" = " + dec.name + ";");
            pr("       return this;");
            pr("    }");
        }
        pr("    "+ast.name+" build() {");
        p("        return new "+ast.name+"(");
        for(var i in ast.classdef.declarations) {
            var dec = ast.classdef.declarations[i];
            if(dec.kind=="synthetic") continue;
            if(i!=0) p(", ");
            p(dec.name);
        }
        pr(");");
        pr("    }");
        pr("  }");
        p("}");
        closeClass();
    }
    if(ast.classtype == "enum") {
        console.log("doing an enum");
        openClass(ast.name);
        pr("public enum " + ast.name + " {");
        for(var i in ast.values) {
            if(i!=0) pr(", ");
            p("    "+ast.values[i]);
        }
        pr("");
        
        pr("}");
        closeClass();
    }
}

function capitalize(s) {
    return s[0].toUpperCase()+s.substr(1);
}

var out;
function p(s) { out.write(s); }
function pr(s) { out.write(s+"\n"); }

function openClass(name) {
    var outfile = basedir+"microgui/"+name+".java";
    console.log("writing to: " + outfile);
    out = fs.createWriteStream(outfile, { flags:'w',encoding:'utf-8',mode:0666});
    pr("package microgui;");
}
function closeClass() {
    out.end();
}
function setBaseDir(dir) {
    console.log("setting dir to: " + dir);
    basedir = dir;
}

module.exports.genJava = genJava;
module.exports.setBaseDir = setBaseDir;
