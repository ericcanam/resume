// standard colours
var colours = {
    keywords: "#E0C85E",
    numvals: "#2DC8E0",
    strings: "#2CE07D",
    comments: "#E02C1B",
    brackets: "#E08326"
}

var langs = {
    Python: {
        keywords: ['__peg_parser__', 'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'print', 'raise', 'return', 'try', 'while', 'with', 'yield'],
        numvals: ['False', 'None', 'True'],
        strings: ['"""', '"', "'"],
        comments: ["#"],
        brackets: ["{", "}", "[", "]", "(", ")"],
        whitespace: [" ", "\n"],
        formatFunc: function(t){
            let nstring = "";
            let inComment = false;
            let inString = false;
            let inNum = false;
            let inBrack = false;

            ml:
            for(let i=0; i<t.length; i++){
                let tt = t.charAt(i);

                if(inComment){
                    nstring += tt;
                    if(tt=="\n"){
                        nstring += "</span>";
                        inComment = false;
                    }
                }else if(inString){
                    if(tt=="\\"){ // skip over escaped strings just in case it's a quote
                        nstring += tt + t.charAt(i+1);
                        i++;
                    }else if(t.substr(i, inString.length)==inString){
                        console.log(inString);
                        nstring += inString+"</span>";
                        i += inString.length-1;
                        inString = false;
                        continue;
                    }else{
                        nstring += tt;
                    }
                }else if(inNum){
                    if(tt>='0' && tt<='9'){
                        nstring += tt;
                    }else{ // friendship with number over. not number is my best friend now
                        inNum = false;
                        nstring += "</span>";
                        i -= 1; // go back over this har
                    }
                }else if(inBrack){
                    if(this.brackets.includes(tt)){
                        nstring += tt;
                    }else{
                        inBrack = false;
                        nstring += "</span>";
                        i -= 1; // go back over this char in case it's something else to colour
                    }
                }else{
                    if(this.comments.includes(tt)){
                        // check to see if line is a comment
                        nstring += "<span style='color:"+colours.comments+";'>";
                        inComment = true;
                    }/*else if(this.strings.includes(tt)){ // this ONLY works for single-character string wrappers
                        nstring += "<span style='color:"+colours.strings+";'>";
                        inString = tt;
                    }*/ else if(tt>='0' && tt<='9' && !((t.charAt(i-1)>='a' && t.charAt(i-1)<='z') || (t.charAt(i-1)>='A' && t.charAt(i-1)<='Z'))){
                        nstring += "<span style='color:"+colours.numvals+";'>";
                        inNum = true;
                    }else if(this.brackets.includes(tt)){
                        nstring += "<span style='color:"+colours.brackets+";'>";
                        inBrack = true;
                    }else{
                        for(sc in this.strings){
                            if(t.substr(i, this.strings[sc].length)==this.strings[sc]){
                                nstring += "<span style='color:"+colours.strings+";'>" + this.strings[sc];
                                i += this.strings[sc].length-1;
                                inString = this.strings[sc];
                                continue ml;
                            }
                        }
                        let pc = t.charAt(i-1);

                        // check if one of the standard keywords
                        for(kw in this.keywords){
                            let fc = t.charAt(i+this.keywords[kw].length);
                            if(t.substr(i, this.keywords[kw].length)==this.keywords[kw] &&
                            // this garbage is all here to make sure it's not part of a var name
                            !((pc>='0' && pc<='9') || (pc>='a' && pc<='z') || (pc>='A' && pc<='Z') || pc=="_") &&
                            !((fc>='0' && fc<='9') || (fc>='a' && fc<='z') || (fc>='A' && pc<='Z') || fc=="_")){
                                
                                nstring += "<span style='color:"+colours.keywords+";'>"+this.keywords[kw]+"</span>";
                                i += this.keywords[kw].length - 1;
                                continue ml;
                            }
                        }
                        // check if one of the boolean/null/whatever keywords
                        for(nv in this.numvals){
                            let fc = t.charAt(i+this.numvals[nv].length);
                            if(t.substr(i, this.numvals[nv].length)==this.numvals[nv] &&
                            // this garbage is all here to make sure it's not part of a var name
                            !((pc>='0' && pc<='9') || (pc>='a' && pc<='z') || (pc>='A' && pc<='Z') || pc=="_") &&
                            !((fc>='0' && fc<='9') || (fc>='a' && fc<='z') || (fc>='A' && pc<='Z') || fc=="_")){
                                
                                nstring += "<span style='color:"+colours.numvals+";'>"+this.numvals[nv]+"</span>";
                                i += this.numvals[nv].length - 1;
                                continue ml;
                            }
                        }
                    }

                    nstring += tt;
                }
            }
            return nstring;
        }
    }
};

function formatCodeBlock(codeblock){
    let ctext = codeblock.innerHTML;
    let clang = codeblock.getAttribute("pp-lang");

    codeblock.innerHTML = langs[clang].formatFunc(ctext);
}


function initialize(){
    let codes = document.getElementsByClassName("code");
    for(let i=0; i<codes.length; i++){
        formatCodeBlock(codes[i]);
    }
}