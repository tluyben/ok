define("ace/mode/k-ok_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var KHighlightRules = function() {
    this.$rules = {
        "start" : [
            {
                // Comments
                token : "comment",
                regex : "\\/.*$"
            },
            {
                // Special numbers (0N, 0w)
                token : "constant.numeric.special",
                regex : "\\b(?:0N|-?0w)\\b"
            },
            {
                // Regular numbers
                token : "constant.numeric",
                regex : "-?\\d*\\.?\\d+"
            },
            {
                // Strings
                token : "string",
                regex : '"(?:[^"\\\\]|\\\\.)*"'
            },
            {
                // Symbols (starting with `)
                token : "constant.language.symbol",
                regex : "`[a-zA-Z][a-zA-Z0-9.]*"
            },
            {
                // Adverbs
                token : "keyword.operator.adverb",
                regex : "['\\\\/:][:]?"
            },
            {
                // Arithmetic operators
                token : "keyword.operator.arithmetic",
                regex : "[+\\-*%]"
            },
            {
                // Comparison operators
                token : "keyword.operator.comparison",
                regex : "[<>=~]"
            },
            {
                // List operators
                token : "keyword.operator.list",
                regex : "[,#_]"
            },
            {
                // Special operators
                token : "keyword.operator.special",
                regex : "[!&|^$?@.:]"
            },
            {
                // Control structures
                token : "keyword.control",
                regex : "\\$\\["
            },
            {
                // Function definition
                token : "keyword.other.function",
                regex : "\\{",
                next  : "function"
            },
            {
                // Names/Identifiers
                token : "identifier",
                regex : "[a-zA-Z][a-zA-Z0-9]*"
            }
        ],
        "function" : [
            {
                // Function arguments
                token : "variable.parameter",
                regex : "\\[[a-zA-Z][a-zA-Z0-9]*(?:;[a-zA-Z][a-zA-Z0-9]*)*\\]"
            },
            {
                token : "keyword.other.function",
                regex : "\\}",
                next  : "start"
            },
            {
                defaultToken : "support.function"
            }
        ]
    };
}

oop.inherits(KHighlightRules, TextHighlightRules);

exports.KHighlightRules = KHighlightRules;
});

define("ace/mode/k-ok", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/mode/k-ok_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var KHighlightRules = require("./k-ok_highlight_rules").KHighlightRules;

var Mode = function() {
    this.HighlightRules = KHighlightRules;
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = "/";
    this.$id = "ace/mode/k-ok";
    
    // Add custom CSS for the editor
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        /* Light theme */
        .ace-tomorrow .ace_comment { color: #6A1B9A !important; }
        .ace-tomorrow .ace_constant.numeric.special { color: #D84315 !important; }
        .ace-tomorrow .ace_constant.numeric { color: #1565C0 !important; }
        .ace-tomorrow .ace_string { color: #2E7D32 !important; }
        .ace-tomorrow .ace_constant.language.symbol { color: #C2185B !important; }
        .ace-tomorrow .ace_keyword.operator.adverb { color: #00838F !important; }
        .ace-tomorrow .ace_keyword.operator.arithmetic { color: #D32F2F !important; }
        .ace-tomorrow .ace_keyword.operator.comparison { color: #F57F17 !important; }
        .ace-tomorrow .ace_keyword.operator.list { color: #1B5E20 !important; }
        .ace-tomorrow .ace_keyword.operator.special { color: #AD1457 !important; }
        .ace-tomorrow .ace_keyword.control { color: #D84315 !important; }
        .ace-tomorrow .ace_keyword.other.function { color: #0277BD !important; }
        .ace-tomorrow .ace_variable.parameter { color: #6A1B9A !important; }
        .ace-tomorrow .ace_support.function { color: #1565C0 !important; }
        .ace-tomorrow .ace_identifier { color: #37474F !important; }

        /* Dark theme */
        .ace-tomorrow-night .ace_comment { color: #CE93D8 !important; }
        .ace-tomorrow-night .ace_constant.numeric.special { color: #FFAB91 !important; }
        .ace-tomorrow-night .ace_constant.numeric { color: #90CAF9 !important; }
        .ace-tomorrow-night .ace_string { color: #A5D6A7 !important; }
        .ace-tomorrow-night .ace_constant.language.symbol { color: #F48FB1 !important; }
        .ace-tomorrow-night .ace_keyword.operator.adverb { color: #80DEEA !important; }
        .ace-tomorrow-night .ace_keyword.operator.arithmetic { color: #EF9A9A !important; }
        .ace-tomorrow-night .ace_keyword.operator.comparison { color: #FFF176 !important; }
        .ace-tomorrow-night .ace_keyword.operator.list { color: #81C784 !important; }
        .ace-tomorrow-night .ace_keyword.operator.special { color: #F48FB1 !important; }
        .ace-tomorrow-night .ace_keyword.control { color: #FFAB91 !important; }
        .ace-tomorrow-night .ace_keyword.other.function { color: #4FC3F7 !important; }
        .ace-tomorrow-night .ace_variable.parameter { color: #CE93D8 !important; }
        .ace-tomorrow-night .ace_support.function { color: #90CAF9 !important; }
        .ace-tomorrow-night .ace_identifier { color: #FFFFFF !important; }
    `;
    document.head.appendChild(style);
}).call(Mode.prototype);

exports.Mode = Mode;
});
