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

function toggleManual() {
  const popover = document.getElementById("manualPopover");
  popover.classList.toggle("active");
  if (popover.classList.contains("active")) {
    renderContent("monads");
  }
}

function loadFiles() {
  const savedFiles = localStorage.getItem("editor_files");
  if (savedFiles) {
    files = JSON.parse(savedFiles);
    renderFiles();

    const lastOpenFileId = localStorage.getItem("last_open_file");
    if (lastOpenFileId) {
      const fileExists = files.some((f) => f.id === parseInt(lastOpenFileId));
      if (fileExists) {
        selectFile(parseInt(lastOpenFileId));
      }
    }
  }
}

function saveFiles() {
  localStorage.setItem("editor_files", JSON.stringify(files));
}

function saveLastOpenFile(fileId) {
  localStorage.setItem("last_open_file", fileId);
}

function toggleTheme() {
  const html = document.documentElement;
  const themeSwitch = document.getElementById("themeSwitch");
  const currentTheme = html.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";

  html.setAttribute("data-theme", newTheme);
  themeSwitch.classList.toggle("dark");

  if (editor) {
    editor.setTheme(
      newTheme === "dark" ? "ace/theme/tomorrow_night" : "ace/theme/tomorrow"
    );
  }

  saveSettings();
}

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("active");
  document.getElementById("sidebarOverlay").classList.toggle("active");
}

function closeSidebar() {
  document.getElementById("sidebar").classList.remove("active");
  document.getElementById("sidebarOverlay").classList.remove("active");
}

function createNewFile() {
  const newFile = {
    id: Date.now(),
    name: "Untitled",
    content: "",
    notes: [],
  };
  files.push(newFile);
  saveFiles();
  renderFiles();
  selectFile(newFile.id);
}

function deleteFile(id) {
  files = files.filter((f) => f.id !== id);
  environments.delete(id);
  lineResults.delete(id);
  saveFiles();
  if (currentFileId === id) {
    currentFileId = null;
    localStorage.removeItem("last_open_file");
    document.getElementById("mainContent").innerHTML =
      '<div class="no-file-message">Select a file to view its contents</div>';
    editor = null;
  }
  renderFiles();
}

function editFileName(id) {
  editingFileId = id;
  const file = files.find((f) => f.id === id);
  document.getElementById("fileNameInput").value = file.name;
  document.getElementById("editDialog").classList.add("active");
  document.getElementById("overlay").classList.add("active");
}

function closeDialog() {
  document.getElementById("editDialog").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
  editingFileId = null;
}

function saveFileName() {
  const newName = document.getElementById("fileNameInput").value.trim();
  if (newName && editingFileId) {
    const file = files.find((f) => f.id === editingFileId);
    if (file) {
      file.name = newName;
      saveFiles();
      renderFiles();
      if (currentFileId === editingFileId) {
        renderCurrentFile();
      }
    }
  }
  closeDialog();
}

function readNote(x) {
  if (!currentFileId) return k(3, []);
  const file = files.find((f) => f.id === currentFileId);
  if (!file || !file.notes) return k(3, []);
  const noteName = tojs(x);
  const note = file.notes.find((n) => n.title === noteName);
  if (!note) return k(3, []);
  const contentArray = note.content.split("\n");
  return tok(contentArray);
}

function writeNote(x, y) {
  if (!currentFileId) return y;
  const file = files.find((f) => f.id === currentFileId);
  if (!file) return y;
  if (!file.notes) file.notes = [];

  const noteName = tojs(x);
  if (noteName.length === 0) {
    const s = tojs(y);
    if (Array.isArray(s)) {
      const result = s.join("\n") + "\n";
      const resultDiv = document.createElement("div");
      resultDiv.className = "ace-line-result";
      resultDiv.textContent = result;
      if (editor && editor.session.widgetManager) {
        const cursorLine = editor.getCursorPosition().row;
        editor.session.widgetManager.addLineWidget({
          row: cursorLine,
          el: resultDiv,
          type: "lineWidget",
          fixedWidth: true,
        });
      }
    }
  } else {
    const existingNote = file.notes.find((n) => n.title === noteName);
    const content = Array.isArray(tojs(y)) ? tojs(y).join("\n") : format(y);

    if (existingNote) {
      existingNote.content = content;
    } else {
      file.notes.push({
        id: Date.now(),
        title: noteName,
        content: content,
      });
    }

    saveFiles();
    renderCurrentFile();
  }

  return y;
}

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

function selectFile(id) {
  currentFileId = id;
  renderCurrentFile();
  saveLastOpenFile(id);
  renderFiles();
  if (window.innerWidth <= 768) {
    closeSidebar();
  }

  if (!environments.has(id)) {
    environments.set(id, baseEnv());
  }

  const file = files.find((f) => f.id === id);
  if (file && file.content) {
    lastContent = file.content;
    executeCode(file.content, environments.get(id));
  }
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

function renderFiles() {
  const filesList = document.getElementById("filesList");
  filesList.innerHTML = files
    .map(
      (file) => `
              <div class="file-item ${
                file.id === currentFileId ? "active" : ""
              }" onclick="selectFile(${file.id})">
                <span>${file.name}</span>
                <div class="file-actions">
                  <button class="icon-btn" onclick="event.stopPropagation(); editFileName(${
                    file.id
                  })">✏️</button>
                  <button class="icon-btn" onclick="event.stopPropagation(); deleteFile(${
                    file.id
                  })">🗑️</button>
                </div>
              </div>
            `
    )
    .join("");
}

function openNotePopover(noteId = null) {
  const notePopover = document.getElementById("notePopover");
  const titleInput = document.getElementById("noteTitleInput");
  const contentInput = document.getElementById("noteContentInput");

  if (noteId) {
    const file = files.find((f) => f.id === currentFileId);
    const note = file.notes.find((n) => n.id === noteId);
    if (note) {
      editingNoteId = noteId;
      titleInput.value = note.title;
      contentInput.value = note.content;
    }
  } else {
    editingNoteId = null;
    titleInput.value = "";
    contentInput.value = "";
  }

  notePopover.classList.add("active");
}

function closeNotePopover() {
  document.getElementById("notePopover").classList.remove("active");
  editingNoteId = null;
}

function saveNote() {
  const title = document.getElementById("noteTitleInput").value.trim();
  const content = document.getElementById("noteContentInput").value.trim();

  if (title && content) {
    const file = files.find((f) => f.id === currentFileId);
    if (file) {
      if (!file.notes) file.notes = [];

      if (editingNoteId) {
        const noteIndex = file.notes.findIndex((n) => n.id === editingNoteId);
        if (noteIndex !== -1) {
          file.notes[noteIndex] = { id: editingNoteId, title, content };
        }
      } else {
        file.notes.push({ id: Date.now(), title, content });
      }

      saveFiles();
      renderCurrentFile();
    }
  }
  closeNotePopover();
}

function editNote(noteId) {
  openNotePopover(noteId);
}

function deleteNote(noteId) {
  const file = files.find((f) => f.id === currentFileId);
  if (file && file.notes) {
    file.notes = file.notes.filter((n) => n.id !== noteId);
    saveFiles();
    renderCurrentFile();
  }
}

function copyNoteTitle(title) {
  if (editor) {
    const position = editor.getCursorPosition();
    editor.session.insert(position, title);
    editor.focus();
  }
}

function insertNoteTitle(title) {
  if (editor) {
    const position = editor.getCursorPosition();
    editor.session.insert(position, title);
    editor.focus();
  }
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
