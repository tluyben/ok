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
