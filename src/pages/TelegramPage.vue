<template>
  <section class="telegram">
    <div class="telegram__container">

      <header class="telegram__header">
        <h2 class="telegram__title t-h1">Telegram Bots</h2>
        <p class="telegram__lead t-body">
          Production bots for payment alerts, AI-powered support, and user onboarding flows.
          Try the live demo below.
        </p>
      </header>

      <div class="telegram__use-cases">
        <div class="telegram__use-case">
          <div class="telegram__use-case-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div class="telegram__use-case-content">
            <h3>AI Customer Support</h3>
            <p>LangChain-powered bots with retrieval-augmented generation over client knowledge bases — automated first-response and ticket routing.</p>
          </div>
        </div>

        <div class="telegram__use-case">
          <div class="telegram__use-case-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
              <line x1="6" y1="1" x2="6" y2="4"></line>
              <line x1="10" y1="1" x2="10" y2="4"></line>
              <line x1="14" y1="1" x2="14" y2="4"></line>
            </svg>
          </div>
          <div class="telegram__use-case-content">
            <h3>Payment & Payout Alerts</h3>
            <p>Real-time transaction notifications integrated with payment APIs — built for the payouts.com tech stack with inline action buttons.</p>
          </div>
        </div>

        <div class="telegram__use-case">
          <div class="telegram__use-case-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <div class="telegram__use-case-content">
            <h3>Onboarding & Data Collection</h3>
            <p>Conversational flows with inline keyboards for user onboarding, form data collection, and CRM integration via webhooks.</p>
          </div>
        </div>
      </div>

      <div class="telegram__demo-section">
        <div class="telegram__phone">
          <div class="telegram__phone-header">
            <div class="telegram__status-bar"></div>
            <div class="telegram__chat-info">
              <div class="telegram__bot-avatar"></div>
              <div class="telegram__bot-info">
                <div class="telegram__bot-name">Portfolio Bot</div>
                <div class="telegram__bot-status">online</div>
              </div>
            </div>
          </div>

          <div class="telegram__chat-window" ref="chatBox">
            <div
              v-for="(message, index) in visibleMessages"
              :key="index"
              :class="['telegram__message', message.isBot ? 'telegram__message--bot' : 'telegram__message--user']"
            >
              <div class="telegram__message-bubble">
                <template v-if="message.type === 'text'">
                  {{ message.text }}
                </template>
                <template v-else-if="message.type === 'buttons'">
                  <div class="telegram__message-text">{{ message.text }}</div>
                  <div class="telegram__buttons">
                    <button
                      v-for="(button, btnIndex) in message.buttons"
                      :key="btnIndex"
                      class="telegram__button-inline"
                      @click="sendBotCommand(button.command)"
                    >
                      {{ button.text }}
                    </button>
                  </div>
                </template>
              </div>
              <div class="telegram__message-time">{{ message.time }}</div>
            </div>

            <div v-if="isTyping" class="telegram__message telegram__message--bot">
              <div class="telegram__message-bubble">
                <div class="telegram__typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>

          <div class="telegram__command-buttons">
            <button
              v-for="(cmd, index) in commandButtons"
              :key="index"
              class="telegram__command-button"
              @click="sendBotCommand(cmd.command)"
            >
              {{ cmd.text }}
            </button>
          </div>

          <form @submit.prevent="sendUserMessage" class="telegram__input-area">
            <input
              v-model="userInput"
              type="text"
              placeholder="Type a message..."
              class="telegram__input"
              :disabled="isTyping"
            />
            <button
              type="submit"
              class="telegram__send-button"
              :disabled="!userInput.trim() || isTyping"
              aria-label="Send message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>

        <div class="telegram__auth-section">
          <h3 class="telegram__auth-title">Telegram Auth Widget</h3>
          <p class="telegram__auth-desc t-small">
            Bots can handle authentication directly — no passwords, no forms.
            Try it:
          </p>
          <div class="telegram__auth-container">
            <div v-if="!loggedIn" ref="telegramButton" class="telegram__auth-button"></div>
            <div v-else class="telegram__auth-result">
              <div class="telegram__auth-avatar" :style="userData.photo_url ? `background-image: url(${userData.photo_url})` : ''"></div>
              <div class="telegram__auth-info">
                <p class="telegram__auth-name">Hello, {{ userData.first_name }}!</p>
                <p class="telegram__auth-sub t-small">
                  <span v-if="userData.username">@{{ userData.username }} · </span>
                  <button @click="logOut" class="telegram__auth-logout">Log out</button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const loggedIn = ref(false)
const userData = ref({})
const telegramButton = ref(null)

const chatBox = ref(null)
const isTyping = ref(false)
const userInput = ref('')
const visibleMessages = ref([])

const commandButtons = [
  { text: '/start', command: '/start' },
  { text: '/help', command: '/help' },
  { text: '/features', command: '/features' }
]

const botResponses = {
  '/start': {
    type: 'buttons',
    text: 'Welcome to my Telegram Bot demo! I can show you different features that can be implemented in custom bots.',
    buttons: [
      { text: 'See Features', command: '/features' },
      { text: 'Get Help', command: '/help' }
    ]
  },
  '/help': {
    type: 'text',
    text: 'This is a live demo of a Telegram bot. Try the command buttons or type a message. For real projects, I build custom bots tailored to your workflow.'
  },
  '/features': {
    type: 'buttons',
    text: 'Features I can implement:',
    buttons: [
      { text: 'User Auth', command: '/auth' },
      { text: 'Inline Menus', command: '/menus' },
      { text: 'Notifications', command: '/notifications' }
    ]
  },
  '/auth': {
    type: 'text',
    text: 'Telegram Login lets you authenticate users without passwords. The widget on this page is a live example — try it.'
  },
  '/menus': {
    type: 'text',
    text: 'Inline keyboards make navigation intuitive. I can build both inline and reply keyboards with conditional flows based on user input.'
  },
  '/notifications': {
    type: 'text',
    text: 'Bots can push real-time alerts — payment events, status changes, scheduled reminders — triggered from your backend or external webhooks.'
  },
  '/auth-success': {
    type: 'text',
    text: 'You just used the Telegram Login Widget. This same flow can authenticate users in any bot or web app.'
  },
  'default': {
    type: 'text',
    text: "I'm a demo bot. For a full custom solution, let's talk about your specific use case."
  }
}

function getCurrentTime() {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}

function sendBotCommand(command) {
  if (isTyping.value) return
  visibleMessages.value.push({ text: command, isBot: false, type: 'text', time: getCurrentTime() })
  scrollToBottom()
  simulateBotResponse(command)
}

function sendUserMessage() {
  if (!userInput.value.trim() || isTyping.value) return
  visibleMessages.value.push({ text: userInput.value, isBot: false, type: 'text', time: getCurrentTime() })
  scrollToBottom()
  const cmd = userInput.value.startsWith('/') ? userInput.value.trim() : 'default'
  userInput.value = ''
  simulateBotResponse(cmd)
}

function simulateBotResponse(command) {
  isTyping.value = true
  scrollToBottom()
  setTimeout(() => {
    isTyping.value = false
    const response = botResponses[command] || botResponses['default']
    visibleMessages.value.push({ ...response, isBot: true, time: getCurrentTime() })
    scrollToBottom()
  }, 800 + Math.random() * 700)
}

function scrollToBottom() {
  nextTick(() => {
    if (chatBox.value) chatBox.value.scrollTop = chatBox.value.scrollHeight
  })
}

function handleTelegramAuth(user) {
  if (!user || !user.id) return
  userData.value = user
  loggedIn.value = true
  sendAuthToServer(user)
}

async function sendAuthToServer(user) {
  try {
    const response = await fetch('/api/telegram-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
      credentials: 'same-origin'
    })
    if (!response.ok) throw new Error(`Status: ${response.status}`)
    simulateBotResponse('/auth-success')
  } catch (error) {
    console.error('Failed to send auth to server:', error)
  }
}

function logOut() {
  userData.value = {}
  loggedIn.value = false
  try {
    fetch('/api/telegram-logout', { method: 'POST', credentials: 'same-origin' })
  } catch (e) {
    console.error('Error logging out:', e)
  }
}

function initTelegramLogin() {
  if (!telegramButton.value) return
  try {
    telegramButton.value.innerHTML = ''
    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.setAttribute('data-telegram-login', 'sendHiFromPortfolioBot')
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-userpic', 'false')
    script.setAttribute('data-onauth', 'handleTelegramAuth')
    script.setAttribute('data-request-access', 'write')
    script.async = true
    script.onerror = () => {
      telegramButton.value.innerHTML = `
        <div class="telegram__auth-error">
          <p>Could not load Telegram login widget.</p>
          <a href="https://t.me/roschek" target="_blank" rel="noopener" class="telegram__contact-link">
            Contact me on Telegram instead
          </a>
        </div>`
    }
    telegramButton.value.appendChild(script)
    window.handleTelegramAuth = handleTelegramAuth
  } catch (error) {
    console.error('Error initializing Telegram login widget:', error)
    if (telegramButton.value) {
      telegramButton.value.innerHTML = `
        <div class="telegram__auth-error">
          <p>Error loading widget: ${error.message}</p>
          <a href="https://t.me/roschek" target="_blank" rel="noopener" class="telegram__contact-link">
            Contact me on Telegram instead
          </a>
        </div>`
    }
  }
}

onMounted(() => {
  initTelegramLogin()
  setTimeout(() => simulateBotResponse('/start'), 500)
})

onUnmounted(() => {
  delete window.handleTelegramAuth
})
</script>

<style scoped>
.telegram {
  padding: 4rem 2rem 6rem;
  min-height: 80vh;
  background-color: var(--bg);
}

.telegram__container {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

/* ─── Header ─────────────────────────────────────────────────────────────── */
.telegram__header {
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--line);
}

.telegram__title {
  margin: 0 0 1rem;
  color: var(--text);
}

.telegram__lead {
  margin: 0;
  max-width: 560px;
  color: var(--text-muted);
}

/* ─── Use cases ──────────────────────────────────────────────────────────── */
.telegram__use-cases {
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  overflow: hidden;
}

.telegram__use-case {
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--line);
  background-color: var(--bg-elevated);
  transition: background-color 0.2s;
}

.telegram__use-case:last-child {
  border-bottom: none;
}

.telegram__use-case:hover {
  background-color: var(--bg-border);
}

.telegram__use-case-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  background-color: var(--accent-dim);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
}

.telegram__use-case-content h3 {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 0.35rem;
}

.telegram__use-case-content p {
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.55;
  margin: 0;
}

/* ─── Demo section ───────────────────────────────────────────────────────── */
.telegram__demo-section {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 3rem;
  align-items: start;
}

/* ─── Phone mock ─────────────────────────────────────────────────────────── */
.telegram__phone {
  width: 320px;
  background-color: #1A1A1A;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid var(--bg-border);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.telegram__phone-header {
  background: linear-gradient(135deg, #0088cc, #0099dd);
  padding: 10px 12px 12px;
}

.telegram__status-bar {
  height: 16px;
}

.telegram__chat-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.telegram__bot-avatar {
  width: 36px;
  height: 36px;
  background-color: white;
  border-radius: 50%;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230088cc"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>');
  background-size: 60%;
  background-position: center;
  background-repeat: no-repeat;
}

.telegram__bot-name {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.9rem;
  color: white;
}

.telegram__bot-status {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
}

.telegram__chat-window {
  height: 320px;
  overflow-y: auto;
  padding: 12px;
  background-color: #212F3D;
  display: flex;
  flex-direction: column;
  gap: 10px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.1) transparent;
}

.telegram__message {
  display: flex;
  flex-direction: column;
  max-width: 80%;
  animation: messageIn 0.25s ease;
}

.telegram__message--user { align-self: flex-end; }
.telegram__message--bot  { align-self: flex-start; }

.telegram__message-bubble {
  padding: 7px 11px;
  border-radius: 12px;
  font-family: var(--font-body);
  font-size: 0.875rem;
  line-height: 1.45;
}

.telegram__message--user .telegram__message-bubble {
  background-color: #2CA5E0;
  color: white;
  border-bottom-right-radius: 3px;
}

.telegram__message--bot .telegram__message-bubble {
  background-color: #2C3E50;
  color: #e2e8f0;
  border-bottom-left-radius: 3px;
}

.telegram__message-time {
  font-size: 0.68rem;
  color: rgba(255,255,255,0.4);
  margin-top: 2px;
  align-self: flex-end;
  font-family: var(--font-mono);
}

.telegram__buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
}

.telegram__button-inline {
  background-color: rgba(255,255,255,0.1);
  border: none;
  padding: 4px 9px;
  border-radius: 4px;
  color: #A3CFEC;
  font-size: 0.8rem;
  cursor: pointer;
  font-family: var(--font-body);
  transition: background-color 0.2s;
}

.telegram__button-inline:hover {
  background-color: rgba(255,255,255,0.2);
}

.telegram__typing {
  display: flex;
  gap: 4px;
  padding: 2px 0;
}

.telegram__typing span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: rgba(255,255,255,0.5);
  animation: typing 1.4s infinite;
}
.telegram__typing span:nth-child(2) { animation-delay: 0.2s; }
.telegram__typing span:nth-child(3) { animation-delay: 0.4s; }

.telegram__command-buttons {
  display: flex;
  gap: 8px;
  padding: 8px 12px;
  background-color: #1e2d3a;
  overflow-x: auto;
}

.telegram__command-button {
  background-color: rgba(0, 136, 204, 0.12);
  border: 1px solid rgba(0, 136, 204, 0.25);
  padding: 5px 10px;
  border-radius: 12px;
  color: #49b3e6;
  white-space: nowrap;
  cursor: pointer;
  font-size: 0.8rem;
  font-family: var(--font-mono);
  transition: background-color 0.2s;
}

.telegram__command-button:hover {
  background-color: rgba(0, 136, 204, 0.25);
}

.telegram__input-area {
  display: flex;
  padding: 8px 10px;
  background-color: #1e2d3a;
  gap: 8px;
}

.telegram__input {
  flex: 1;
  padding: 8px 12px;
  border-radius: 16px;
  border: none;
  background-color: #2C3E50;
  color: #e2e8f0;
  font-family: var(--font-body);
  font-size: 0.875rem;
}

.telegram__input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 136, 204, 0.4);
}

.telegram__input::placeholder { color: rgba(255,255,255,0.3); }

.telegram__send-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #0088cc;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color 0.2s;
}

.telegram__send-button:hover:not(:disabled) { background-color: #0099dd; }
.telegram__send-button:disabled { background-color: #2C3E50; cursor: not-allowed; }

/* ─── Auth panel ─────────────────────────────────────────────────────────── */
.telegram__auth-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.telegram__auth-title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text);
  margin: 0;
}

.telegram__auth-desc {
  color: var(--text-muted);
  margin: 0;
}

.telegram__auth-container {
  margin-top: 0.5rem;
}

.telegram__auth-result {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: var(--bg-elevated);
  border: 1px solid var(--line);
  padding: 0.75rem 1rem;
  border-radius: var(--radius);
}

.telegram__auth-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--bg-border);
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
}

.telegram__auth-name {
  font-family: var(--font-body);
  font-weight: 600;
  color: var(--text);
  margin: 0 0 0.2rem;
}

.telegram__auth-sub {
  color: var(--text-muted);
  margin: 0;
}

.telegram__auth-logout {
  background: none;
  border: none;
  color: var(--accent);
  cursor: pointer;
  font-family: var(--font-body);
  font-size: inherit;
  padding: 0;
  text-decoration: underline;
}

.telegram__auth-error {
  background-color: var(--bg-elevated);
  border: 1px solid var(--line);
  padding: 1rem;
  border-radius: var(--radius);
}

.telegram__auth-error p {
  color: var(--text-muted);
  margin: 0 0 0.5rem;
  font-size: 0.875rem;
}

.telegram__contact-link {
  color: var(--accent);
  text-decoration: none;
  font-size: 0.875rem;
  font-family: var(--font-body);
}

.telegram__contact-link:hover { text-decoration: underline; }

/* ─── Animations ─────────────────────────────────────────────────────────── */
@keyframes messageIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes typing {
  0%, 100% { transform: translateY(0); opacity: 0.4; }
  50%       { transform: translateY(-4px); opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .telegram__message { animation: none; }
  .telegram__typing span { animation: none; }
}

/* ─── Mobile ─────────────────────────────────────────────────────────────── */
@media (max-width: 900px) {
  .telegram__demo-section {
    grid-template-columns: 1fr;
  }

  .telegram__phone {
    width: 100%;
    max-width: 360px;
    margin: 0 auto;
  }
}

@media (max-width: 600px) {
  .telegram {
    padding: 3rem 1.25rem 4rem;
  }

  .telegram__use-case {
    padding: 1rem 1.25rem;
  }
}
</style>
