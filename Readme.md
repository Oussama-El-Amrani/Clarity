# 🤖 AI Text Explainer (Chrome Extension)

Select any text on a page and get an instant AI answer or explanation in a slide-in sidebar. Supports OpenAI and Google Gemini; API keys stay local.

## Features

- Right-click "Explain this text" on any selection
- OpenAI or Gemini; direct-answer or explain modes
- Modern sidebar UI with copy button and close/done actions
- Local-only storage for keys; no tracking

## Install

1. Clone/download this folder.
2. Chrome → `chrome://extensions/` → enable Developer mode → Load unpacked → pick the folder.

## Setup

1. Click the extension icon → choose provider → paste your API key → Save.
2. Default mode is Direct Answer; switch to Explain in the popup if you want richer output.

## Use

1. Highlight text → right-click → "Explain this text with AI".
2. Sidebar opens with loading, then the AI response.
3. Copy or close/done when finished. `Esc` also closes.

## API Keys

- OpenAI: https://platform.openai.com/api-keys (keys start with `sk-`).
- Gemini: https://makersuite.google.com/app/apikey (free tier available).


## Privacy

- API keys stored locally (Chrome sync storage).
- Keys are only sent to the provider you chose; no other data collection.

