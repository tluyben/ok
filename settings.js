// Settings management
function loadSettings() {
  const settings = JSON.parse(localStorage.getItem("settings") || "{}");

  // Load theme
  const savedTheme = settings.theme || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  if (savedTheme === "dark") {
    document.getElementById("themeSwitch").classList.add("dark");
  }

  // Load API provider
  if (settings.apiProvider) {
    const radio = document.querySelector(
      `input[name="api-provider"][value="${settings.apiProvider}"]`
    );
    if (radio) radio.checked = true;
  }

  // Load API keys
  if (settings.anthropicKey) {
    document.getElementById("anthropicKey").value = settings.anthropicKey;
  }
  if (settings.openaiKey) {
    document.getElementById("openaiKey").value = settings.openaiKey;
  }
  if (settings.openrouterKey) {
    document.getElementById("openrouterKey").value = settings.openrouterKey;
  }
}

function saveSettings() {
  const settings = {
    theme: document.documentElement.getAttribute("data-theme"),
    apiProvider: document.querySelector('input[name="api-provider"]:checked')
      ?.value,
    anthropicKey: document.getElementById("anthropicKey").value,
    openaiKey: document.getElementById("openaiKey").value,
    openrouterKey: document.getElementById("openrouterKey").value,
  };
  localStorage.setItem("settings", JSON.stringify(settings));
}

function toggleSettings() {
  const popover = document.getElementById("settingsPopover");
  const isActive = popover.classList.toggle("active");
  document.getElementById("overlay").classList.toggle("active", isActive);
}

// Add event listeners for settings changes
document.addEventListener("DOMContentLoaded", () => {
  loadSettings();

  // API provider radio buttons
  document.querySelectorAll('input[name="api-provider"]').forEach((radio) => {
    radio.addEventListener("change", saveSettings);
  });

  // API key inputs
  document
    .getElementById("anthropicKey")
    .addEventListener("change", saveSettings);
  document.getElementById("openaiKey").addEventListener("change", saveSettings);
  document
    .getElementById("openrouterKey")
    .addEventListener("change", saveSettings);

  // Close settings when clicking overlay
  document.getElementById("overlay").addEventListener("click", () => {
    document.getElementById("settingsPopover").classList.remove("active");
    document.getElementById("overlay").classList.remove("active");
  });
});
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
