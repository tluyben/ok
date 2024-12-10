(typeof window !== "undefined" ? window : global).conv = {
  tojs,
  tok,
};

let files = [];
let currentFileId = null;
let editingFileId = null;
let editor = null;
let editingNoteId = null;
let environments = new Map();
let lineResults = new Map();
let currentMarkers = [];
let lastContent = "";

function executeCode(code, env, changedLine = -1) {
  try {
    for (let i = 0; i < 2; i++) {
      setIO("0:", i, readNote);
    }
    for (let i = 2; i < 6; i++) {
      setIO("0:", i, writeNote);
    }

    const lines = code.split("\n");
    const results = new Map();
    let result;

    if (changedLine !== lines.length - 1) {
      env = baseEnv();
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        try {
          result = run(parse(line), env, true);
          results.set(i, { type: "result", value: format(result) });
        } catch (e) {
          results.set(i, { type: "error", value: e.message });
        }
      }
    }

    lineResults.set(currentFileId, results);
    environments.set(currentFileId, env);
    updateLineResults();
    return result;
  } catch (e) {
    console.error("Error executing code:", e);
    return null;
  }
}

function updateLineResults() {
  if (!currentFileId || !editor) return;

  currentMarkers.forEach((marker) => {
    editor.session.removeGutterDecoration(marker.row, marker.className);
    if (marker.widget) {
      editor.session.widgetManager.removeLineWidget(marker.widget);
    }
  });
  currentMarkers = [];

  const results = lineResults.get(currentFileId);
  if (!results) return;

  const cursorLine = editor.getCursorPosition().row;

  results.forEach((result, line) => {
    const resultDiv = document.createElement("div");
    resultDiv.className = `ace-line-result ${
      result.type === "error" ? "ace-line-error" : ""
    }`;

    let displayValue = result.value;
    if (line !== cursorLine && displayValue.length > 100) {
      displayValue = displayValue.substring(0, 100) + "...";
    }
    resultDiv.textContent = ">>> " + displayValue;

    const className = result.type === "error" ? "ace-line-error" : "";
    editor.session.addGutterDecoration(line, className);

    if (!editor.session.widgetManager) {
      const LineWidgets = ace.require("ace/line_widgets").LineWidgets;
      editor.session.widgetManager = new LineWidgets(editor.session);
      editor.session.widgetManager.attach(editor);
    }

    const widget = editor.session.widgetManager.addLineWidget({
      row: line,
      el: resultDiv,
      type: "lineWidget",
      fixedWidth: true,
    });

    currentMarkers.push({
      row: line,
      className: className,
      widget: widget,
    });
  });
}

function initEditor() {
  editor = ace.edit("editor");
  editor.setTheme(
    document.documentElement.getAttribute("data-theme") === "dark"
      ? "ace/theme/tomorrow_night"
      : "ace/theme/tomorrow"
  );
  editor.session.setMode("ace/mode/k-ok");
  editor.setOptions({
    fontSize: "14px",
    showPrintMargin: false,
    behavioursEnabled: false,
  });

  const LineWidgets = ace.require("ace/line_widgets").LineWidgets;
  editor.session.widgetManager = new LineWidgets(editor.session);
  editor.session.widgetManager.attach(editor);

  let saveTimeout;
  editor.session.on("change", function (e) {
    if (currentFileId) {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        const file = files.find((f) => f.id === currentFileId);
        if (file) {
          const newContent = editor.getValue();
          const oldLines = lastContent.split("\n");
          const newLines = newContent.split("\n");

          let changedLineIndex = -1;
          for (let i = 0; i < Math.max(oldLines.length, newLines.length); i++) {
            if (oldLines[i] !== newLines[i]) {
              changedLineIndex = i;
              break;
            }
          }

          file.content = newContent;
          lastContent = newContent;
          saveFiles();

          const env = environments.get(currentFileId);
          if (env) {
            executeCode(file.content, env, changedLineIndex);
          }
        }
      }, 500);
    }
  });

  editor.selection.on("changeCursor", function () {
    updateLineResults();
  });
}

function findLastNonEmptyLine(content) {
  const lines = content.split("\n");
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trim() !== "") {
      return i;
    }
  }
  return 0;
}

function renderCurrentFile() {
  const file = files.find((f) => f.id === currentFileId);
  if (!file) return;

  document.getElementById("mobileTitle").textContent = file.name;

  const mobileNotesList = document.getElementById("mobileNotes");
  if (mobileNotesList) {
    mobileNotesList.innerHTML = file.notes
      ? file.notes
          .map(
            (note) => `
            <div class="note-item" onclick="insertNoteTitle('${note.title}')">
              ${note.title}
              <button class="icon-btn" onclick="event.stopPropagation(); editNote(${note.id})">✏️</button>
              <button class="icon-btn" onclick="event.stopPropagation(); copyNoteTitle('${note.title}')">📋</button>
              <button class="icon-btn" onclick="event.stopPropagation(); deleteNote(${note.id})">🗑️</button>
            </div>
          `
          )
          .join("")
      : "";
  }

  const notesList = file.notes
    ? file.notes
        .map(
          (note) => `
          <div class="note-item" onclick="insertNoteTitle('${note.title}')">
            ${note.title}
            <button class="icon-btn" onclick="event.stopPropagation(); editNote(${note.id})">✏️</button>
            <button class="icon-btn" onclick="event.stopPropagation(); copyNoteTitle('${note.title}')">📋</button>
            <button class="icon-btn" onclick="event.stopPropagation(); deleteNote(${note.id})">🗑️</button>
          </div>
        `
        )
        .join("")
    : "";

  document.getElementById("mainContent").innerHTML = `
          <div class="title-bar">
            <h2>${file.name}</h2>
            <button class="icon-btn" onclick="openNotePopover()">➕</button>
            <div class="notes-list">${notesList}</div>
          </div>
          <div id="editor"></div>
        `;

  initEditor();
  const content = file.content;
  editor.setValue(content, -1);

  // Find the last non-empty line and move cursor there
  const lastNonEmptyLine = findLastNonEmptyLine(content);
  const lastLineContent = content.split("\n")[lastNonEmptyLine];
  editor.gotoLine(lastNonEmptyLine + 1, lastLineContent.length, true);
  editor.focus();
}

loadSettings();
loadFiles();
renderFiles();

// Initialize category buttons
document.querySelectorAll(".category-btn").forEach((button) => {
  button.addEventListener("click", (e) => {
    document
      .querySelectorAll(".category-btn")
      .forEach((btn) => btn.classList.remove("active"));
    e.target.classList.add("active");
    renderContent(e.target.dataset.category);
  });
});
