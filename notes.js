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
