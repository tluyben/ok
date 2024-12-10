function toggleManual() {
  const popover = document.getElementById("manualPopover");
  popover.classList.toggle("active");
  if (popover.classList.contains("active")) {
    renderContent("monads");
  }
}

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("active");
  document.getElementById("sidebarOverlay").classList.toggle("active");
}

function closeSidebar() {
  document.getElementById("sidebar").classList.remove("active");
  document.getElementById("sidebarOverlay").classList.remove("active");
}

function closeDialog() {
  document.getElementById("editDialog").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
  editingFileId = null;
}
