<template>
  <section class="telegram">
    <div class="telegram__content">
      <h2 class="telegram__title">Telegram Bot Development</h2>
      
      <p class="telegram__description">
        I create intelligent, scalable and user-friendly Telegram bots to automate 
        tasks, provide services, and connect with your audience.
      </p>
      
      <div class="telegram__features">
        <div class="telegram__feature">
          <div class="telegram__feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div class="telegram__feature-content">
            <h3>Customer Support</h3>
            <p>Automated chat support with smart routing to live agents when needed</p>
          </div>
        </div>
        
        <div class="telegram__feature">
          <div class="telegram__feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div class="telegram__feature-content">
            <h3>Notifications</h3>
            <p>Timely alerts and updates for your services, events, or deadlines</p>
          </div>
        </div>
        
        <div class="telegram__feature">
          <div class="telegram__feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div class="telegram__feature-content">
            <h3>Smart Assistant</h3>
            <p>AI-powered helpers to answer questions and provide information</p>
          </div>
        </div>
      </div>

      <div class="telegram__demo">
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
              :class="[
                'telegram__message', 
                message.isBot ? 'telegram__message--bot' : 'telegram__message--user'
              ]"
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
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
        
        <div class="telegram__how-it-works">
          <h3>How Telegram Bots Work</h3>
          <ul class="telegram__steps">
            <li class="telegram__step">
              <div class="telegram__step-number">1</div>
              <p>Bot receives messages and commands from users</p>
            </li>
            <li class="telegram__step">
              <div class="telegram__step-number">2</div>
              <p>Server processes requests and prepares responses</p>
            </li>
            <li class="telegram__step">
              <div class="telegram__step-number">3</div>
              <p>Bot sends back messages, buttons, or media</p>
            </li>
            <li class="telegram__step">
              <div class="telegram__step-number">4</div>
              <p>Integration with external services for extended functionality</p>
            </li>
          </ul>
        </div>
      </div>      
      <div class="telegram__auth-section">
        <h3>Try Telegram Auth</h3>
        <p>Experience seamless authentication through Telegram's secure login widget:</p>
        
        <div class="telegram__auth-container">
          <div v-if="!loggedIn" ref="telegramButton" class="telegram__auth-button"></div>
          
          <div v-else class="telegram__auth-result">
            <div class="telegram__auth-avatar" :style="userData.photo_url ? `background-image: url(${userData.photo_url})` : ''"></div>
            <div class="telegram__auth-info">
              <h4>👋 Hello, {{ userData.first_name }}!</h4>
              <p>
                You've successfully authenticated via Telegram.
                <span v-if="userData.username">Your username is <b>@{{ userData.username }}</b>.</span>
                <button @click="logOut" class="telegram__auth-logout">Log Out</button>
              </p>
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
    text: 'This is a demonstration of what a Telegram bot can do. Try the command buttons below or type a question. For real projects, I can create custom bots with various features tailored to your needs.'
  },
  '/features': {
    type: 'buttons',
    text: 'Here are some features I can implement in Telegram bots:',
    buttons: [
      { text: 'User Authentication', command: '/auth' },
      { text: 'Interactive Menus', command: '/menus' },
      { text: 'Notifications', command: '/notifications' }
    ]
  },
  '/auth': {
    type: 'text',
    text: 'User authentication allows your bot to verify user identity and provide personalized experiences. It can integrate with various auth systems and databases.'
  },
  '/menus': {
    type: 'text',
    text: 'Interactive menus make navigation intuitive. I can create both inline keyboards and custom reply keyboards for your bot.'
  },
  '/notifications': {
    type: 'text',
    text: 'Bots can send scheduled notifications, alerts, and updates to users. These can be triggered by time, events, or external systems.'
  },
  '/auth-success': {
    type: 'text',
    text: 'Great! You just experienced the Telegram Login Widget integration. This feature can be used in your own bots to provide seamless authentication.'
  },
  'default': {
    type: 'text',
    text: "I'm a demo bot. For a full-featured solution, let's discuss your specific requirements and create a custom Telegram bot for your needs."
  }
}

function getCurrentTime() {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}

function sendBotCommand(command) {
  if (isTyping.value) return
  
  const userMessage = {
    text: command,
    isBot: false,
    type: 'text',
    time: getCurrentTime()
  }
  
  visibleMessages.value.push(userMessage)
  scrollToBottom()
  
  simulateBotResponse(command)
}

function sendUserMessage() {
  if (!userInput.value.trim() || isTyping.value) return
  
  const message = {
    text: userInput.value,
    isBot: false,
    type: 'text',
    time: getCurrentTime()
  }
  
  visibleMessages.value.push(message)
  scrollToBottom()
  
  const userCommand = userInput.value.startsWith('/') ? userInput.value.trim() : 'default'
  userInput.value = ''
  
  simulateBotResponse(userCommand)
}

function simulateBotResponse(command) {
  isTyping.value = true
  scrollToBottom()
  
  setTimeout(() => {
    isTyping.value = false
    
    const response = botResponses[command] || botResponses['default']
    const botMessage = {
      ...response,
      isBot: true,
      time: getCurrentTime()
    }
    
    visibleMessages.value.push(botMessage)
    scrollToBottom()
  }, 1000 + Math.random() * 1000) 
}

function scrollToBottom() {
  nextTick(() => {
    if (chatBox.value) {
      chatBox.value.scrollTop = chatBox.value.scrollHeight
    }
  })
}

function handleTelegramAuth(user) {
  if (!user || !user.id) {
    console.warn('No user data received from Telegram')
    return
  }
  
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
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('Auth successful:', data)
    
    simulateBotResponse('/auth-success')
  } catch (error) {
    console.error('Failed to send auth to server:', error)
  }
}

function logOut() {
  userData.value = {}
  loggedIn.value = false
  
  try {
    fetch('/api/telegram-logout', {
      method: 'POST',
      credentials: 'same-origin'
    })
  } catch (error) {
    console.error('Error logging out:', error)
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
          <p>Could not load Telegram login widget. Please try again later.</p>
          <a href="https://t.me/roschek" target="_blank" class="telegram__contact-link">
            Contact me directly on Telegram
          </a>
        </div>
      `
    }
    
    telegramButton.value.appendChild(script)
    
    window.handleTelegramAuth = handleTelegramAuth
  } catch (error) {
    console.error('Error initializing Telegram login widget:', error)
    
    if (telegramButton.value) {
      telegramButton.value.innerHTML = `
        <div class="telegram__auth-error">
          <p>Error loading Telegram widget: ${error.message}</p>
          <a href="https://t.me/roschek" target="_blank" class="telegram__contact-link">
            Contact me directly on Telegram
          </a>
        </div>
      `
    }
  }
}


onMounted(() => {
  
  initTelegramLogin()
  
  setTimeout(() => {
    simulateBotResponse('/start')
  }, 500)
})

onUnmounted(() => {  
  delete window.handleTelegramAuth
})
</script>

<style scoped>
.telegram {
  padding: 2rem;
  min-height: 80vh;
  background-color: #0F172A;
  color: white;
}

.telegram__content {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.telegram__title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
  padding-bottom: 0.5rem;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

.telegram__title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #0088cc, transparent);
  border-radius: 3px;
}

.telegram__description {
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
  font-size: 1.1rem;
  color: #CBD5E1;
  line-height: 1.6;
}

.telegram__features {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 1rem;
}

.telegram__feature {
  background-color: rgba(31, 41, 55, 0.5);
  border-radius: 10px;
  padding: 1.5rem;
  width: 300px;
  display: flex;
  gap: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.telegram__feature:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
}

.telegram__feature-icon {
  background-color: rgba(0, 136, 204, 0.15);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0088cc;
}

.telegram__feature-content h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.telegram__feature-content p {
  color: #CBD5E1;
  font-size: 0.9rem;
  line-height: 1.5;
}

.telegram__demo {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.telegram__phone {
  width: 320px;
  height: 580px;
  background-color: #1A1A1A;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
  position: relative;
  border: 6px solid #2A2A2A;
}

.telegram__phone-header {
  background: linear-gradient(135deg, #0088cc, #0099dd);
  height: 80px;
  padding: 10px;
  position: relative;
}

.telegram__status-bar {
  height: 20px;
}

.telegram__chat-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.telegram__bot-avatar {
  width: 40px;
  height: 40px;
  background-color: white;
  border-radius: 50%;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230088cc"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>');
  background-size: 60%;
  background-position: center;
  background-repeat: no-repeat;
}

.telegram__bot-name {
  font-weight: bold;
  color: white;
}

.telegram__bot-status {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

.telegram__chat-window {
  height: 350px;
  overflow-y: auto;
  padding: 15px;
  background-color: #212F3D;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.telegram__message {
  display: flex;
  flex-direction: column;
  max-width: 80%;
  animation: messageIn 0.3s ease;
}

.telegram__message--user {
  align-self: flex-end;
}

.telegram__message--bot {
  align-self: flex-start;
}

.telegram__message-bubble {
  padding: 8px 12px;
  border-radius: 12px;
  position: relative;
}

.telegram__message--user .telegram__message-bubble {
  background-color: #2CA5E0;
  color: white;
  border-bottom-right-radius: 3px;
}

.telegram__message--bot .telegram__message-bubble {
  background-color: #2C3E50;
  color: white;
  border-bottom-left-radius: 3px;
}

.telegram__message-time {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 2px;
  align-self: flex-end;
}

.telegram__buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 10px;
}

.telegram__button-inline {
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  color: #A3CFEC;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.telegram__button-inline:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.telegram__typing {
  display: flex;
  gap: 5px;
}

.telegram__typing span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  animation: typing 1.4s infinite;
}

.telegram__typing span:nth-child(2) {
  animation-delay: 0.2s;
}

.telegram__typing span:nth-child(3) {
  animation-delay: 0.4s;
}

.telegram__command-buttons {
  display: flex;
  gap: 10px;
  padding: 10px;
  background-color: #212F3D;
  overflow-x: auto;
  justify-content: center;
}

.telegram__command-button {
  background-color: rgba(0, 136, 204, 0.15);
  border: none;
  padding: 8px 12px;
  border-radius: 20px;
  color: #0088cc;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.3s ease;
}

.telegram__command-button:hover {
  background-color: rgba(0, 136, 204, 0.3);
}

.telegram__input-area {
  display: flex;
  padding: 10px;
  background-color: #212F3D;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
}

.telegram__input {
  flex: 1;
  padding: 10px 15px;
  border-radius: 20px;
  border: none;
  background-color: #2C3E50;
  color: white;
}

.telegram__input:focus {
  outline: none;
}

.telegram__send-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #0088cc;
  border: none;
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.telegram__send-button:hover:not(:disabled) {
  background-color: #0099dd;
}

.telegram__send-button:disabled {
  background-color: #455A64;
  cursor: not-allowed;
}

/* How it works section */
.telegram__how-it-works {
  max-width: 400px;
}

.telegram__how-it-works h3 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
  padding-bottom: 0.5rem;
}

.telegram__how-it-works h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 2px;
  background-color: #0088cc;
  border-radius: 1px;
}

.telegram__steps {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.telegram__step {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.telegram__step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: rgba(0, 136, 204, 0.15);
  color: #0088cc;
  font-weight: bold;
}

.telegram__step p {
  margin: 0;
  color: #CBD5E1;
  flex: 1;
  line-height: 1.6;
}

.telegram__auth-section {
  background-color: rgba(31, 41, 55, 0.5);
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
}

.telegram__auth-section h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.telegram__auth-section p {
  color: #CBD5E1;
  margin-bottom: 1.5rem;
}

.telegram__auth-container {
  display: flex;
  justify-content: center;
}

.telegram__auth-result {
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: rgba(0, 136, 204, 0.1);
  padding: 1rem;
  border-radius: 8px;
  max-width: 500px;
  margin: 0 auto;
  text-align: left;
}

.telegram__auth-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #455A64;
  background-size: cover;
  background-position: center;
}

.telegram__auth-info h4 {
  margin-bottom: 0.5rem;
}

.telegram__auth-logout {
  background-color: transparent;
  border: none;
  color: #0088cc;
  margin-left: 10px;
  cursor: pointer;
  text-decoration: underline;
}

.telegram__auth-error {
  background-color: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.telegram__contact-link {
  display: inline-block;
  margin-top: 0.5rem;
  color: #0088cc;
  text-decoration: none;
}

.telegram__contact-link:hover {
  text-decoration: underline;
}

@keyframes messageIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes typing {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-5px);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .telegram__demo {
    flex-direction: column;
  }
  
  .telegram__features {
    flex-direction: column;
    align-items: center;
  }
  
  .telegram__feature {
    width: 100%;
    max-width: 400px;
  }
}
</style>