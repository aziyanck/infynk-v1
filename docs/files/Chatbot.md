# `src/components/Chatbot.jsx`

**Location**: `src/components/Chatbot.jsx` (263 lines)

## File Purpose

The floating "Support AI" chat bubble. Wakes up an external n8n chatbot on mount, lets the user send messages, and shows a WhatsApp contact button when the bot is offline.

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React, { useState, useRef, useEffect }` | `react` | State + effects. |
| `FontAwesomeIcon` + 3 solid + 1 brand icons | `@fortawesome/react-fontawesome` + `@fortawesome/free-solid-svg-icons` + `@fortawesome/free-brands-svg-icons` | UI icons. |

## Exports

### `Chatbot` (default)

## Internal State

| State | Purpose |
|-------|---------|
| `isOpen` | Chat window open/closed. |
| `messages` | Chat history. |
| `inputText` | Current input. |
| `isLoading` | True while waiting for the webhook. |
| `isBotReady` | True after the wake-up call returns (success or fail). |
| `hasError` | True after a failed send. |
| `messagesEndRef` | Auto-scroll anchor. |
| `sessionIdRef = useRef('user123')` | Stable per-tab session id. |
| `webhookUrl` | `https://n8n-szm5.onrender.com/webhook/pixy-chat` |

## Internal Logic

* `useEffect` (mount) → `wakeUpBot()` POSTs `{ message: 'wake up', sessionId: 'user123' }`. Sets `isBotReady = true` regardless of success.
* `sendMessage`:
  * If `hasError`, append a fallback message and return.
  * POST `{ message, sessionId }` to the webhook. Parse JSON (fallback to text). Resolve `reply` from `data.reply || data.output || data.text || data.message`.
  * On error → set `hasError = true` + append a fallback WhatsApp message.
* Renders:
  * Floating bubble (disabled / spinner until ready).
  * Chat window with header, message list, input + send button.
  * "Contact Support" WhatsApp button on any fallback message (`https://wa.me/9188802136`).

## Used By

* `src/pages/LandingPage.jsx`.

## Risks

* `sessionIdRef = 'user123'` is shared by every user — backend loses per-user context.
* Public webhook URL; no auth.
* The `onerror` path of `wakeUpBot` still sets `isBotReady = true`, so the user can open the chat even when the bot is offline (then the next `sendMessage` will fall back to the WhatsApp button).
