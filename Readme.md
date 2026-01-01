# 🤖 AI Text Explainer - Chrome Extension

A powerful Chrome extension that lets you select any text on any webpage and get instant AI-powered explanations using OpenAI GPT or Google Gemini.

## ✨ Features

- **Context Menu Integration**: Right-click on selected text to explain
- **Dual AI Support**: Choose between OpenAI GPT-4 or Google Gemini
- **Beautiful UI**: Clean, modern sidebar that slides in smoothly
- **Error Handling**: Graceful handling of API errors and edge cases
- **Secure**: API keys stored locally, never sent elsewhere
- **Fast**: Instant explanations with loading indicators
- **Copy Function**: One-click copy of explanations

## 📦 Installation

### Step 1: Download Files

Create a new folder called `ai-text-explainer` and save all these files:

```
ai-text-explainer/
├── manifest.json
├── background.js
├── content.js
├── popup.html
├── popup.js
├── styles.css
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

### Step 2: Create Icons

You need to create three icon files. You can:

**Option A - Use a placeholder:**
1. Download any PNG image
2. Resize it to 16x16, 48x48, and 128x128 pixels
3. Name them `icon16.png`, `icon48.png`, `icon128.png`
4. Place them in an `icons` folder

**Option B - Create your own:**
Use any image editor to create simple icons with these dimensions.

**Option C - Use online generator:**
Visit https://www.favicon-generator.org/ to generate icons from any image.

### Step 3: Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in top-right corner)
3. Click **"Load unpacked"**
4. Select the `ai-text-explainer` folder
5. The extension should now appear in your extensions list!

### Step 4: Configure API Key

1. Click the extension icon in Chrome toolbar
2. Choose your AI provider (OpenAI or Gemini)
3. Enter your API key
4. Click "Save Settings"

## 🔑 Getting API Keys

### OpenAI GPT API

1. Visit https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. Paste into extension settings

**Cost**: ~$0.01 per 1,000 tokens (GPT-4-turbo)

### Google Gemini API

1. Visit https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API key"
4. Copy the key
5. Paste into extension settings

**Cost**: Free tier available (60 requests/minute)

## 🚀 Usage

1. Go to any webpage
2. Select any text (highlight it)
3. Right-click on the selected text
4. Click **"Explain this text with AI"**
5. Wait for the AI explanation to appear in the sidebar
6. Copy the explanation or close the sidebar when done

**Keyboard Shortcut**: Press `Esc` to close the sidebar

## 🛠️ Customization

### Change AI Model

Edit `background.js`:

**For OpenAI** (line 98):
```javascript
model: 'gpt-4-turbo',  // Change to 'gpt-3.5-turbo' for faster/cheaper
```

**For Gemini** (line 156):
Use `gemini-pro` (already set)

### Customize Sidebar Position

Edit `styles.css`:

```css
/* Change from right to left side */
.ai-explainer-sidebar {
  left: -420px;  /* Instead of right: -420px */
}

.ai-explainer-sidebar.ai-explainer-show {
  left: 0;  /* Instead of right: 0 */
}
```

### Change Colors

Edit `styles.css` (line 34-35):
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

Replace with your preferred gradient colors!

### Adjust Sidebar Width

Edit `styles.css` (line 10):
```css
width: 400px;  /* Change to 300px, 500px, etc. */
```

## 🐛 Troubleshooting

### Extension doesn't appear
- Make sure Developer mode is enabled
- Check for errors in `chrome://extensions/`
- Reload the extension

### Context menu doesn't show
- Refresh the webpage
- Make sure text is actually selected
- Check extension permissions

### API errors
- Verify API key is correct
- Check you have credits/quota available
- Check your internet connection
- Look at Chrome DevTools console (F12) for details

### Sidebar doesn't appear
- Check browser console for JavaScript errors
- Make sure content script is injected
- Try reloading the page

## 📝 Code Structure

### background.js
- Creates context menu
- Handles API calls to OpenAI/Gemini
- Manages error handling
- Sends responses to content script

### content.js
- Injects sidebar into webpage
- Displays loading/success/error states
- Handles user interactions (close, copy)
- Manages sidebar animations

### popup.html & popup.js
- Settings/configuration page
- Saves API key and provider selection
- Validates input

### styles.css
- All sidebar styling
- Animations and transitions
- Responsive design

## 🔒 Privacy & Security

- API keys stored locally in Chrome sync storage
- Keys never sent to any server except the chosen AI provider
- No data collection or tracking
- Open source - inspect all code yourself

## 📄 License

MIT License - Free to use, modify, and distribute

## 🤝 Contributing

Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Share with others

## 💡 Tips

- Use GPT-3.5-turbo for faster responses
- Keep selected text under 500 words for best results
- Close sidebar with Esc key for quick workflow
- The extension works on most websites (except Chrome Web Store pages)

## ⚠️ Limitations

- Cannot work on Chrome extension pages or chrome:// URLs
- API rate limits apply based on your provider
- Requires active internet connection
- API costs may apply (check provider pricing)

---

**Enjoy explaining text with AI! 🚀**

For issues or questions, check the Chrome DevTools console or review the code comments.