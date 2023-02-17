// standard colours
var colours = {
    keywords: "#E0C85E",
    numvals: "#2DC8E0",
    strings: "#2CE07D",
    comments: "#E02C1B",
    brackets: "#E08326"
}

function isPartVar(pc, fc){
    return (pc>='0' && pc<='9') || (pc>='a' && pc<='z') || (pc>='A' && pc<='Z') || pc=="_" ||
    (fc>='0' && fc<='9') || (fc>='a' && fc<='z') || (fc>='A' && pc<='Z') || fc=="_";
}

function formatCode(t, lang){
    let nstring = "";
    let inComment = false;
    let inCloseComment = false;
    let inString = false;
    let inNum = false;
    let inBrack = false;

    ml:
    for(let i=0; i<t.length; i++){
        let tt = t.charAt(i);

        if(inComment){ // check for newline
            nstring += tt;
            if(tt=="\n"){
                nstring += "</span>";
                inComment = false;
            }
        }else if(inCloseComment){
            if(t.substr(i, inCloseComment.length)==inCloseComment){
                nstring += inCloseComment + "</span>";
                i += inCloseComment.length-1;
                inCloseComment = false;
            }else{
                nstring += tt;
            }
        }else if(inString){
            if(tt=="\\"){ // skip over escaped strings just in case it's a quote
                nstring += tt + t.charAt(i+1);
                i++;
            }else if(t.substr(i, inString.length)==inString){
                // console.log(inString);
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
            if(lang.brackets.includes(tt)){
                nstring += tt;
            }else{
                inBrack = false;
                nstring += "</span>";
                i -= 1; // go back over this char in case it's something else to colour
            }
        }else{
            if(tt>='0' && tt<='9' && !((t.charAt(i-1)>='a' && t.charAt(i-1)<='z') || (t.charAt(i-1)>='A' && t.charAt(i-1)<='Z'))){
                nstring += "<span style='color:"+colours.numvals+";'>";
                inNum = true;
            }else if(lang.brackets.includes(tt)){
                nstring += "<span style='color:"+colours.brackets+";'>";
                inBrack = true;
            }else{
                // single-line comments
                for(co in lang.comments){
                    if(t.substr(i, lang.comments[co].length)==lang.comments[co]){
                        nstring += "<span style='color:"+colours.comments+";'>" + lang.comments[co];
                        i += lang.comments[co].length - 1;
                        inComment = true;
                        continue ml;
                    }
                }

                // multi-line comments (must be closed, NOT by newline)
                for(cc in lang.closeComments){
                    if(t.substr(i, lang.closeComments[cc][0].length)==lang.closeComments[cc][0]){
                        nstring += "<span style='color:"+colours.comments+";'>" + lang.closeComments[cc][0];
                        i += lang.closeComments[cc][0].length - 1;
                        inCloseComment = lang.closeComments[cc][1];
                        continue ml;
                    }
                }

                

                // string wrapper
                for(sc in lang.strings){
                    if(t.substr(i, lang.strings[sc].length)==lang.strings[sc]){
                        nstring += "<span style='color:"+colours.strings+";'>" + lang.strings[sc];
                        i += lang.strings[sc].length-1;
                        inString = lang.strings[sc];
                        continue ml;
                    }
                }
                let pc = t.charAt(i-1);

                // check if one of the standard keywords
                for(kw in lang.keywords){
                    let fc = t.charAt(i+lang.keywords[kw].length);
                    if(t.substr(i, lang.keywords[kw].length)==lang.keywords[kw] && !isPartVar(pc, fc)){
                        
                        nstring += "<span style='color:"+colours.keywords+";'>"+lang.keywords[kw]+"</span>";
                        i += lang.keywords[kw].length - 1;
                        continue ml;
                    }
                }
                // check if one of the boolean/null/whatever keywords
                for(nv in lang.numvals){
                    let fc = t.charAt(i+lang.numvals[nv].length);
                    if(t.substr(i, lang.numvals[nv].length)==lang.numvals[nv] && !isPartVar(pc, fc)){
                        
                        nstring += "<span style='color:"+colours.numvals+";'>"+lang.numvals[nv]+"</span>";
                        i += lang.numvals[nv].length - 1;
                        continue ml;
                    }
                }
            }

            nstring += tt;
        }
    }
    return nstring;
}

var langs = {
    Python: {
        keywords: ['__peg_parser__', 'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global',
            'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'print', 'raise', 'return', 'try', 'while', 'with', 'yield'],
        numvals: ['False', 'None', 'True'],
        strings: ['"""', '"', "'"],
        comments: ["#"],
        closeComments: [],
        brackets: ["{", "}", "[", "]", "(", ")"],
        formatFunc: function(t){
            return formatCode(t, this);
        }
    },

    CSS: {
        keywords: [
            'autofill', 'fullscreen', 'modal', 'picture-in-picture', 'enabled', 'disabled', 'read-only', 'read-write', 'placeholder-shown', 'default', 'checked',
            'indeterminate', 'blank', 'valid', 'invalid', 'in-range', 'out-of-range', 'required', 'optional', 'user-invalid', 'dir', 'lang',

            'active', 'empty', 'first-child', 'first-of-type', 'focus', 'hover', 'last-child', 'last-of-type',
            'link', 'not', 'nth-child', 'nth-last-child', 'nth-last-of-type', 'nth-of-type', 'only-of-type', 'only-child',
            'root', 'target', 'visited', 'after', 'before', 'first-letter', 'first-line', 'marker', 'selection',

            'inherit', 'none', 'var', 'and', 'or',
        
            '@media', '@supports', '@font-face', '@document', '@page', '@keyframes', '@layer', '@property', '@charset', '@color-profile', '@container', '@counter-style', '@import', '@namespace'
        ],
        numvals: [],
        strings: ['"', "'"],
        comments: [],
        closeComments: [["/*", "*/"]],
        brackets: ["{", "}", "[", "]", "(", ")"],
        formatFunc: function(t){
            return formatCode(t, this);
        }
    },

    HTML: {
        keywords: [
            '!DOCTYPE', 'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button',
            'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset',
            'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'h1 to h6', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend',
            'li', 'link', 'main', 'map', 'mark', 'meta', 'meter', 'nav', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress',
            'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'svg', 'table', 'tbody', 'td',
            'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr'
        ],
        numvals: [],
        strings: ['"', "'"],
        comments: [],
        closeComments: [["&lt;!--", "--&gt;"]],
        brackets: ["<", ">"],
        formatFunc: function(t){
            return formatCode(t, this);
        }
    },

    JavaScript: {
        keywords: [
            'abstract', 'arguments', 'await', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'double', 'else',
            'enum', 'eval', 'export', 'extends', 'final', 'finally', 'float', 'for', 'function', 'goto', 'if', 'implements', 'import', 'in', 'instanceof', 'int', 'interface',
            'let', 'long', 'native', 'new', 'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws',
            'transient', 'try', 'typeof', 'var', 'void', 'volatile', 'while', 'with', 'yield'
        ],
        numvals: ['true', 'false', 'null'],
        strings: ['"', "'"],
        comments: ["//"],
        closeComments: [["/*", "*/"]],
        brackets: ["{", "}", "[", "]", "(", ")"],
        formatFunc: function(t){
            return formatCode(t, this);
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