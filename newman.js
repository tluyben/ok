const referenceData = {
  monads: [
    {
      symbol: ":",
      name: "Gets",
      description: "Gets value from name",
      example: ": variable",
    },
    {
      symbol: "+",
      name: "Flip",
      description: "Flip matrix/table",
      example: "+((1 2 3;4 5 6))",
    },
    {
      symbol: "-",
      name: "Negate",
      description: "Arithmetic negation",
      example: "-2",
    },
    {
      symbol: "*",
      name: "First",
      description: "First element",
      example: "*1 2 3",
    },
    {
      symbol: "%",
      name: "Square Root",
      description: "Square root of number",
      example: "%16",
    },
    {
      symbol: "!",
      name: "Enumerate/Key",
      description: "Create range/Get keys",
      example: "!5",
    },
    {
      symbol: "&",
      name: "Where",
      description: "Indices where true",
      example: "&1 0 1 1",
    },
    {
      symbol: "|",
      name: "Reverse",
      description: "Reverse items",
      example: "|1 2 3",
    },
    {
      symbol: "<",
      name: "Ascending",
      description: "Sort ascending indices",
      example: "<3 1 4",
    },
    {
      symbol: ">",
      name: "Descending",
      description: "Sort descending indices",
      example: ">3 1 4",
    },
    {
      symbol: "=",
      name: "Group",
      description: "Group indices",
      example: "=1 2 1 3",
    },
    {
      symbol: "~",
      name: "Not",
      description: "Logical not",
      example: "~0 1 0",
    },
    {
      symbol: ",",
      name: "Enlist",
      description: "Make single item list",
      example: ",1",
    },
    {
      symbol: "^",
      name: "Null",
      description: "Is null",
      example: "^0N 1 0N",
    },
    {
      symbol: "#",
      name: "Count",
      description: "Count items",
      example: "#1 2 3",
    },
    {
      symbol: "_",
      name: "Floor",
      description: "Floor number",
      example: "_3.7",
    },
    {
      symbol: "$",
      name: "String",
      description: "Convert to string",
      example: "$123",
    },
    {
      symbol: "?",
      name: "Distinct",
      description: "Unique values",
      example: "?1 2 1 3",
    },
    {
      symbol: "@",
      name: "Type",
      description: "Get type",
      example: "@42",
    },
    {
      symbol: ".",
      name: "Value",
      description: "Evaluate/Value",
      example: '."1+2"',
    },
  ],
  dyads: [
    {
      symbol: "+",
      name: "Add",
      description: "Addition",
      example: "2 + 3",
    },
    {
      symbol: "-",
      name: "Subtract",
      description: "Subtraction",
      example: "5 - 3",
    },
    {
      symbol: "*",
      name: "Multiply",
      description: "Multiplication",
      example: "4 * 5",
    },
    {
      symbol: "%",
      name: "Divide",
      description: "Division",
      example: "6 % 2",
    },
    {
      symbol: "!",
      name: "Mod/Map",
      description: "Modulo/Dictionary",
      example: "7!3\n`a`b!1 2",
    },
    {
      symbol: "&",
      name: "Min/And",
      description: "Minimum/Logical and",
      example: "3&5\n1&0",
    },
    {
      symbol: "|",
      name: "Max/Or",
      description: "Maximum/Logical or",
      example: "3|5\n1|0",
    },
    {
      symbol: "<",
      name: "Less",
      description: "Less than",
      example: "2 < 3",
    },
    {
      symbol: ">",
      name: "More",
      description: "Greater than",
      example: "2 > 3",
    },
    {
      symbol: "=",
      name: "Equal",
      description: "Equality test",
      example: "2 = 2",
    },
    {
      symbol: "~",
      name: "Match",
      description: "Exact match",
      example: "2 ~ 2",
    },
    {
      symbol: ",",
      name: "Join",
      description: "Concatenate",
      example: "1,2",
    },
    {
      symbol: "^",
      name: "Fill",
      description: "Fill null values",
      example: "0^0N 1 0N",
    },
    {
      symbol: "#",
      name: "Take/Reshape",
      description: "Take n items/Reshape",
      example: "2#1 2 3",
    },
    {
      symbol: "_",
      name: "Drop/Cut",
      description: "Drop n items",
      example: "2_1 2 3",
    },
    {
      symbol: "$",
      name: "Cast",
      description: "Type cast",
      example: '`int$"123"',
    },
    {
      symbol: "?",
      name: "Find/Random",
      description: "Find/Generate random",
      example: "2 3 4?3",
    },
    {
      symbol: "@",
      name: "At",
      description: "Index at position",
      example: "x@2",
    },
    {
      symbol: ".",
      name: "Apply",
      description: "Apply/Index",
      example: "d.`key",
    },
  ],
  adverbs: [
    {
      symbol: "'",
      name: "Each",
      description: "Apply to each element",
      example: "-'(1 2 3)",
    },
    {
      symbol: "/",
      name: "Over/Join",
      description: "Reduce/Join",
      example: "+/(1 2 3 4)\n,/(1 2;3 4)",
    },
    {
      symbol: "\\",
      name: "Scan/Split",
      description: "Running reduce/Split",
      example: "+\\(1 2 3 4)",
    },
    {
      symbol: "':",
      name: "Each Prior",
      description: "Pairwise apply",
      example: "-':(1 2 3 4)",
    },
    {
      symbol: "/:",
      name: "Each Right",
      description: "Apply with fixed right",
      example: "+/:(1 2 3;4)",
    },
    {
      symbol: "\\:",
      name: "Each Left",
      description: "Apply with fixed left",
      example: "+\\:(1;2 3 4)",
    },
  ],
  control: [
    {
      symbol: "$[c;t;f]",
      name: "If",
      description: "If-then-else conditional",
      example: "$[x>0;x;0]  / absolute value",
    },
    {
      symbol: "?[x;i;f;y]",
      name: "Insert",
      description: "Insert at positions",
      example: "?[1 2 3;1;4]  / insert 4 at pos 1",
    },
    {
      symbol: "@[x;i;f;y]",
      name: "Amend",
      description: "Modify at positions",
      example: "@[1 2 3;1;+;10]  / add 10 at pos 1",
    },
    {
      symbol: ".[x;i;f;y]",
      name: "Deep Amend",
      description: "Modify nested values",
      example: ".[matrix;0 1;+;10]  / add 10 at [0;1]",
    },
  ],
  types: [
    {
      symbol: "name",
      name: "Symbol",
      description: "Symbolic names",
      example: "`a`b",
    },
    {
      symbol: "char",
      name: "Character",
      description: "Character strings",
      example: '"ab"',
    },
    {
      symbol: "num",
      name: "Number",
      description: "Integers and floats",
      example: "2 3.14",
    },
    {
      symbol: "hex",
      name: "Hexadecimal",
      description: "Hex numbers",
      example: "0x2a2b",
    },
    {
      symbol: "bool",
      name: "Boolean",
      description: "Boolean values",
      example: "01000b",
    },
    {
      symbol: "null",
      name: "Null",
      description: "Special values",
      example: "0N (null) 0w (inf)",
    },
    {
      symbol: "list",
      name: "List",
      description: "Value collections",
      example: "(2;3.4;`ab)",
    },
    {
      symbol: "dict",
      name: "Dictionary",
      description: "Key-value pairs",
      example: "`a`b!(2;`c)",
    },
    {
      symbol: "func",
      name: "Function",
      description: "Lambda functions",
      example: "{[x;y]x+y}",
    },
  ],
  system: [
    {
      symbol: "0:",
      name: "File I/O",
      description: "File operations",
      example: '0:"file.txt"',
    },
    {
      symbol: "1:",
      name: "JSON I/O",
      description: "JSON operations",
      example: '1:"data.json"',
    },
    {
      symbol: "5:",
      name: "String Form",
      description: "String representation",
      example: "5:1 2 3",
    },
    {
      symbol: "\\t",
      name: "Time",
      description: "Time execution",
      example: "\\t x",
    },
    {
      symbol: "\\\\",
      name: "Exit",
      description: "Exit interpreter",
      example: "\\\\",
    },
  ],
};

function createCard(item) {
  return `
                <div class="card">
                    <div class="card-header">
                        <span class="symbol">${item.symbol}</span>
                        <span class="card-name">${item.name}</span>
                    </div>
                    <div class="card-content">
                        <div class="description">${item.description}</div>
                        <div class="example">${item.example}</div>
                    </div>
                </div>
            `;
}

function renderContent(category) {
  const container = document.getElementById("content");
  container.innerHTML = referenceData[category]
    .map((item) => createCard(item))
    .join("");
}

document.querySelectorAll(".category-btn").forEach((button) => {
  button.addEventListener("click", (e) => {
    document
      .querySelectorAll(".category-btn")
      .forEach((btn) => btn.classList.remove("active"));
    e.target.classList.add("active");
    renderContent(e.target.dataset.category);
  });
});

// Initial render
renderContent("monads");
