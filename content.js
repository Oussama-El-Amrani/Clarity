// ============================================
// AI Text Explainer - Content Script
// ============================================

// Global reference to the sidebar element
let sidebarElement = null;

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "loading") {
    showLoadingState(message.text);
  } else if (message.type === "success") {
    showExplanation(message.explanation, message.originalText);
  } else if (message.type === "error") {
    showError(message.message);
  }
});

/**
 * Create and display the sidebar with loading state
 * @param {string} selectedText - The text being explained
 */
function showLoadingState(selectedText) {
  ensureStylesInjected();
  // Remove any existing sidebars to avoid stacked instances
  removeAllSidebars();

  // Create sidebar container
  sidebarElement = document.createElement("div");
  sidebarElement.id = "ai-explainer-sidebar";
  sidebarElement.className = "ai-explainer-sidebar";

  // Create sidebar content with loading spinner
  sidebarElement.innerHTML = `
    <div class="ai-explainer-header">
      <div class="ai-explainer-header-content">
        <div class="ai-explainer-header-icon">🤖</div>
        <div>
          <h3>AI Explanation</h3>
          <div class="ai-explainer-header-subtitle">Powered by AI</div>
        </div>
      </div>
      <button type="button" class="ai-explainer-close" id="ai-explainer-close-btn">✕</button>
    </div>
    <div class="ai-explainer-content">
      <div class="ai-explainer-section">
        <div class="ai-explainer-section-header">
          <div class="ai-explainer-section-icon">📝</div>
          <h4>Selected Text</h4>
        </div>
        <p class="ai-explainer-selected-text">${escapeHtml(
          truncateText(selectedText, 200)
        )}</p>
      </div>
      <div class="ai-explainer-loading">
        <div class="ai-explainer-spinner"></div>
        <p>Analyzing with AI...</p>
      </div>
    </div>
    <div class="ai-explainer-footer">
      <p>✨ AI Text Explainer</p>
    </div>
  `;

  // Append to body
  document.body.appendChild(sidebarElement);

  attachActionHandlers();

  // Trigger animation
  setTimeout(() => {
    sidebarElement.classList.add("ai-explainer-show");
  }, 10);
}

/**
 * Ensure the extension stylesheet is injected on the page
 */
function ensureStylesInjected() {
  const existing = document.getElementById("ai-explainer-style-tag");
  if (existing) return;

  const link = document.createElement("link");
  link.id = "ai-explainer-style-tag";
  link.rel = "stylesheet";
  link.href = chrome.runtime.getURL("styles.css");
  document.head.appendChild(link);

  // Fallback: critical inline styles in case the stylesheet is blocked
  const inline = document.createElement("style");
  inline.id = "ai-explainer-inline-style";
  inline.textContent = `
    .ai-explainer-sidebar {
      position: fixed;
      top: 0;
      right: -450px;
      width: 420px;
      height: 100vh;
      background: linear-gradient(180deg, #fafbfc 0%, #ffffff 100%);
      box-shadow: -4px 0 30px rgba(0, 0, 0, 0.12), -1px 0 8px rgba(0, 0, 0, 0.08);
      z-index: 2147483647;
      transition: right 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border-left: 1px solid rgba(0, 0, 0, 0.06);
    }
    .ai-explainer-sidebar.ai-explainer-show { right: 0; }
    .ai-explainer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .ai-explainer-header h3 { margin: 0; font-size: 18px; font-weight: 600; }
    .ai-explainer-close {
      background: rgba(255, 255, 255, 0.15);
      border: none;
      color: white;
      font-size: 18px;
      width: 36px;
      height: 36px;
      border-radius: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .ai-explainer-content { flex: 1; overflow-y: auto; padding: 24px; }
    .ai-explainer-section { margin-bottom: 24px; }
    .ai-explainer-section-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
    .ai-explainer-section-icon {
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
    }
    .ai-explainer-section h4 { margin: 0; font-size: 12px; font-weight: 700; color: #4b5563; text-transform: uppercase; letter-spacing: 0.8px; flex: 1; }
    .ai-explainer-badge {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      font-size: 10px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 6px rgba(16, 185, 129, 0.3);
    }
    .ai-explainer-quote-card {
      position: relative;
      background: linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%);
      padding: 20px 20px 16px 20px;
      border-radius: 16px;
      border: 1px solid rgba(102, 126, 234, 0.12);
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9);
    }
    .ai-explainer-quote-mark { position: absolute; top: 8px; left: 16px; font-size: 32px; color: #667eea; opacity: 0.3; line-height: 1; }
    .ai-explainer-selected-text { color: #3b4a6b; font-size: 14px; line-height: 1.7; margin: 0; font-style: italic; padding-left: 8px; border-left: 3px solid #667eea; }
    .ai-explainer-answer-card { background: linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%); border-radius: 20px; padding: 4px; box-shadow: 0 8px 32px rgba(245, 158, 11, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04); }
    .ai-explainer-explanation {
      background: linear-gradient(180deg, #ffffff 0%, #fffef8 100%);
      padding: 24px;
      border-radius: 16px;
      border: 1px solid rgba(245, 158, 11, 0.2);
      color: #1f2937;
      font-size: 15px;
      line-height: 1.9;
      box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.9);
      position: relative;
    }
    .ai-explainer-explanation::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #f59e0b 0%, #d97706 50%, #f59e0b 100%); border-radius: 16px 16px 0 0; }
    .ai-explainer-explanation p { margin: 0 0 16px 0; text-align: left; }
    .ai-explainer-actions { display: flex; gap: 12px; padding-top: 16px; border-top: 1px solid #e5e7eb; margin-top: 8px; }
    .ai-explainer-btn { flex: 1; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 14px 20px; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.25s ease; display: flex; align-items: center; justify-content: center; gap: 8px; }
    .ai-explainer-btn-secondary { background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); color: #374151; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); }
    .ai-explainer-footer { padding: 16px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; }
    .ai-explainer-footer p { margin: 0; font-size: 11px; color: #94a3b8; font-weight: 500; letter-spacing: 0.3px; }
  `;
  document.head.appendChild(inline);
}

/**
 * Update sidebar with the explanation
 * @param {string} explanation - The AI explanation
 * @param {string} originalText - The original selected text
 */
function showExplanation(explanation, originalText) {
  if (!sidebarElement) {
    showLoadingState(originalText);
  }

  // Update content with explanation
  const contentDiv = sidebarElement.querySelector(".ai-explainer-content");
  contentDiv.innerHTML = `
    <div class="ai-explainer-section">
      <div class="ai-explainer-section-header">
        <div class="ai-explainer-section-icon">📝</div>
        <h4>Selected Text</h4>
      </div>
      <div class="ai-explainer-quote-card">
        <div class="ai-explainer-quote-mark">❝</div>
        <p class="ai-explainer-selected-text">${escapeHtml(
          truncateText(originalText, 200)
        )}</p>
      </div>
    </div>
    <div class="ai-explainer-section">
      <div class="ai-explainer-section-header">
        <div class="ai-explainer-section-icon ai-explainer-icon-answer">💡</div>
        <h4>AI Response</h4>
        <span class="ai-explainer-badge">✨ Generated</span>
      </div>
      <div class="ai-explainer-answer-card">
        <div class="ai-explainer-explanation">${formatExplanation(
          explanation
        )}</div>
      </div>
    </div>
    <div class="ai-explainer-actions">
      <button type="button" class="ai-explainer-btn ai-explainer-btn-secondary" id="ai-explainer-copy-btn">
        <span class="ai-explainer-btn-icon">📋</span>
        <span>Copy</span>
      </button>
      <button type="button" class="ai-explainer-btn" id="ai-explainer-close-action-btn">
        <span class="ai-explainer-btn-icon">✓</span>
        <span>Done</span>
      </button>
    </div>
  `;

  attachActionHandlers(explanation);
}

/**
 * Show error message in sidebar
 * @param {string} errorMessage - The error message to display
 */
function showError(errorMessage) {
  if (!sidebarElement) {
    removeAllSidebars();
    // Create sidebar if it doesn't exist
    sidebarElement = document.createElement("div");
    sidebarElement.id = "ai-explainer-sidebar";
    sidebarElement.className = "ai-explainer-sidebar";
    document.body.appendChild(sidebarElement);
  }

  // Update content with error message
  sidebarElement.innerHTML = `
    <div class="ai-explainer-header">
      <div class="ai-explainer-header-content">
        <div class="ai-explainer-header-icon">🤖</div>
        <div>
          <h3>AI Explanation</h3>
          <div class="ai-explainer-header-subtitle">Something went wrong</div>
        </div>
      </div>
      <button type="button" class="ai-explainer-close" id="ai-explainer-close-btn">✕</button>
    </div>
    <div class="ai-explainer-content">
      <div class="ai-explainer-error">
        <div class="ai-explainer-error-icon">⚠️</div>
        <p class="ai-explainer-error-message">${escapeHtml(errorMessage)}</p>
        ${
          errorMessage.includes("API key")
            ? `
          <button type="button" class="ai-explainer-btn ai-explainer-settings-btn" id="ai-explainer-settings-btn">
            ⚙️ Open Settings
          </button>
        `
            : ""
        }
      </div>
    </div>
    <div class="ai-explainer-footer">
      <p>✨ AI Text Explainer</p>
    </div>
  `;

  attachActionHandlers();

  // Trigger animation
  setTimeout(() => {
    sidebarElement.classList.add("ai-explainer-show");
  }, 10);
}

/**
 * Remove the sidebar from the page
 */
function removeSidebar() {
  if (sidebarElement) {
    sidebarElement.classList.remove("ai-explainer-show");

    // Wait for animation to complete before removing
    setTimeout(() => {
      removeAllSidebars();
    }, 300);
  }
}

/**
 * Remove all ai-explainer sidebars from the DOM
 */
function removeAllSidebars() {
  const sidebars = document.querySelectorAll("#ai-explainer-sidebar");
  sidebars.forEach((el) => el.remove());
  sidebarElement = null;
}

/**
 * Wire up action buttons safely, stopping bubbling that some pages intercept
 * @param {string} explanation - optional explanation text for copy action
 */
function attachActionHandlers(explanation) {
  const closeBtn = document.getElementById("ai-explainer-close-btn");
  if (closeBtn) {
    closeBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      removeSidebar();
    };
  }

  const doneBtn = document.getElementById("ai-explainer-close-action-btn");
  if (doneBtn) {
    doneBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      removeSidebar();
    };
  }

  const copyBtn = document.getElementById("ai-explainer-copy-btn");
  if (copyBtn && typeof explanation === "string") {
    copyBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      copyToClipboard(explanation);
    };
  }

  const settingsBtn = document.getElementById("ai-explainer-settings-btn");
  if (settingsBtn) {
    settingsBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      chrome.runtime.sendMessage({ action: "openSettings" });
      removeSidebar();
    };
  }
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 */
function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      // Show success feedback
      const copyBtn = document.getElementById("ai-explainer-copy-btn");
      if (copyBtn) {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "✓ Copied!";
        copyBtn.style.backgroundColor = "#10b981";

        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.style.backgroundColor = "";
        }, 2000);
      }
    })
    .catch((err) => {
      console.error("Failed to copy text:", err);
      alert("Failed to copy to clipboard");
    });
}

/**
 * Format the explanation text (preserve line breaks, add formatting)
 * @param {string} text - The explanation text
 * @returns {string} - Formatted HTML
 */
function formatExplanation(text) {
  const clean = escapeHtml(text).trim();
  if (!clean) return "";

  // Split into sentences/lines and make bullets when multiple items exist
  const parts = clean
    .split(/\n+/)
    .map((p) => p.split(/(?<=[.!?])\s+/))
    .flat()
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length > 1) {
    return `<ul class="ai-explainer-list">${parts
      .map((item) => `<li>${item}</li>`)
      .join("")}</ul>`;
  }

  // Fallback to paragraph
  return `<p>${clean.replace(/\n/g, "<br>")}</p>`;
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Close sidebar when clicking outside
document.addEventListener("click", (event) => {
  if (
    sidebarElement &&
    !sidebarElement.contains(event.target) &&
    sidebarElement.classList.contains("ai-explainer-show")
  ) {
    // Don't close if clicking on selected text or context menu
    if (!window.getSelection().toString()) {
      // Optional: uncomment to close on outside click
      // removeSidebar();
    }
  }
});

// Close sidebar on Escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && sidebarElement) {
    removeSidebar();
  }
});
