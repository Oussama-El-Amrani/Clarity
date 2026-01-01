// ============================================
// AI Text Explainer - Popup Script
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("settingsForm");
  const apiKeyInput = document.getElementById("apiKey");
  const openaiRadio = document.getElementById("openai");
  const geminiRadio = document.getElementById("gemini");
  const explainRadio = document.getElementById("explain");
  const directRadio = document.getElementById("direct");
  const messageDiv = document.getElementById("message");
  const saveBtn = document.getElementById("saveBtn");

  // Load saved settings
  loadSettings();

  // Handle form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const apiKey = apiKeyInput.value.trim();
    const apiProvider = document.querySelector(
      'input[name="apiProvider"]:checked'
    ).value;
    const responseMode = document.querySelector(
      'input[name="responseMode"]:checked'
    ).value;

    // Validate API key
    if (!apiKey) {
      showMessage("Please enter your API key.", "error");
      return;
    }

    // Validate API key format
    if (apiProvider === "openai" && !apiKey.startsWith("sk-")) {
      showMessage(
        'OpenAI API keys typically start with "sk-". Please check your key.',
        "error"
      );
      return;
    }

    // Disable button during save
    saveBtn.disabled = true;
    saveBtn.textContent = "Saving...";

    try {
      // Save settings to Chrome storage
      await chrome.storage.sync.set({
        apiKey: apiKey,
        apiProvider: apiProvider,
        responseMode: responseMode,
      });

      showMessage(
        "Settings saved successfully! You can now close this popup.",
        "success"
      );
    } catch (error) {
      showMessage("Error saving settings: " + error.message, "error");
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = "Save Settings";
    }
  });

  // Load saved settings from Chrome storage
  async function loadSettings() {
    try {
      const data = await chrome.storage.sync.get([
        "apiKey",
        "apiProvider",
        "responseMode",
      ]);

      if (data.apiKey) {
        apiKeyInput.value = data.apiKey;
      }

      if (data.apiProvider) {
        if (data.apiProvider === "openai") {
          openaiRadio.checked = true;
        } else if (data.apiProvider === "gemini") {
          geminiRadio.checked = true;
        }
      }

      if (data.responseMode === "explain") {
        explainRadio.checked = true;
      } else {
        directRadio.checked = true; // default to direct
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  }

  /**
   * Display a message to the user
   * @param {string} text - The message text
   * @param {string} type - 'success' or 'error'
   */
  function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = "message " + type;

    // Auto-hide success messages after 3 seconds
    if (type === "success") {
      setTimeout(() => {
        messageDiv.className = "message";
      }, 3000);
    }
  }

  // Update placeholder text when provider changes
  openaiRadio.addEventListener("change", () => {
    apiKeyInput.placeholder = "Enter your OpenAI API key (starts with sk-)";
  });

  geminiRadio.addEventListener("change", () => {
    apiKeyInput.placeholder = "Enter your Google Gemini API key";
  });
});
