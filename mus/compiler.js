// maybe some helper functions
var endTime = function (time, expr) {
    if(expr.tag == 'note') {
        console.log("returning " + expr.pitch);
        return time + expr.dur;
    }
    return endTime(time, expr.left) + endTime(time, expr.right);
};

var compileT = function(time, musexpr) {
    if(musexpr.tag == 'note') {
        var ret= [{ tag:'note', 
                pitch:musexpr.pitch,
                start:time, 
                dur:musexpr.dur
               }];
        console.log(ret);
        return ret;
    }
    if(musexpr.tag == 'rest') {
        var ret = [{tag:'rest', duration:100}]
        return ret;                
    }
    var arr = [];
    var e1 = endTime(0,musexpr.left);
    console.log("time = " + e1);
    var c1 = compileT(time,musexpr.left);
    for(var ca in c1) { arr.push(c1[ca]); }
    var c2 = compileT(time+e1,musexpr.right);
    for(var cb in c2) { arr.push(c2[cb]); }
    return arr;
};

var compile = function (musexpr) {
    var ret = compileT(0,musexpr);
    console.log(ret);
    return ret;
};


var melody_mus = 
    { tag: 'seq',
      left: 
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'note', pitch: 'b4', dur: 250 } },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };

console.log(melody_mus);
console.log(compile(melody_mus));

