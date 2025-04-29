<template>
  <section class="telegram">
    <div class="telegram__content">
      <h2 class="telegram__title">Telegram Bots Projects</h2>

      <p class="telegram__description">
        I create smart, reliable, and scalable Telegram bots to automate tasks, provide services, and connect with users.
      </p>

      <div class="telegram__chat">
        <div class="telegram__chat-window" ref="chatBox">
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="['telegram__message', message.isBot ? 'telegram__message--bot' : 'telegram__message--user']"
          >
            <span class="telegram__message-sender">{{ message.isBot ? 'Bot' : 'You' }}:</span> {{ message.text }}
          </div>
        </div>

        <form @submit.prevent="sendMessage" class="telegram__form">
          <input v-model="input" type="text" placeholder="Type a message..." class="telegram__input" />
          <button type="submit" class="telegram__button">Send</button>
        </form>
      </div>

      <div id="telegram-login" class="telegram__login"></div>
    </div>
  </section>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'

const input = ref('')
const messages = ref([
  { text: 'Hello! I am your Telegram assistant 🤖', isBot: true }
])

const chatBox = ref(null)

onMounted(() => {
  const script = document.createElement('script');
  script.src = 'https://telegram.org/js/telegram-widget.js?22';
  script.setAttribute('data-telegram-login', 'sendHiFromPortfolioBot');
  script.setAttribute('data-size', 'large');
  script.setAttribute('data-auth-url', '/api/telegram-auth');
  script.setAttribute('data-request-access', 'write');
  script.async = true;
  document.getElementById('telegram-login').appendChild(script);
})

function sendMessage() {
  if (input.value.trim() === '') return

  messages.value.push({ text: input.value, isBot: false })

  const userMessage = input.value
  input.value = ''

  setTimeout(() => {
    messages.value.push({
      text: generateBotReply(userMessage),
      isBot: true
    })
    scrollToBottom()
  }, 500)

  scrollToBottom()
}

function generateBotReply(userText) {
  if (userText.toLowerCase().includes('hello')) return 'Hello there! 👋'
  if (userText.toLowerCase().includes('help')) return 'How can I assist you? 🤔'
  return 'Sorry, I am just a demo bot. But I can help you build real ones! 🚀'
}

function scrollToBottom() {
  nextTick(() => {
    if (chatBox.value) {
      chatBox.value.scrollTop = chatBox.value.scrollHeight
    }
  })
}
</script>

<style scoped>

.telegram {
  padding: 2rem;
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.telegram__content {
  max-width: 600px;
  text-align: center;
}

.telegram__title {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.telegram__description {
  font-size: 1.125rem;
  color: #ccc;
  margin-bottom: 2rem;
}

.telegram__chat {
  background-color: #1F2937;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 2rem;
}

.telegram__chat-window {
  height: 300px;
  overflow-y: auto;
  background-color: #111827;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.telegram__message {
  margin-bottom: 0.75rem;
}

.telegram__message--bot {
  color: #38bdf8;
}

.telegram__message--user {
  color: #34D399;
}

.telegram__message-sender {
  font-weight: bold;
  margin-right: 0.5rem;
}

.telegram__form {
  display: flex;
  gap: 1rem;
}

.telegram__input {
  flex-grow: 1;
  padding: 0.75rem;
  border-radius: 8px;
  border: none;
  background-color: #374151;
  color: white;
}

.telegram__button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  background-color: #38bdf8;
  color: white;
  border: none;
  cursor: pointer;
}

.telegram__button:hover {
  background-color: #0ea5e9;
}

.telegram__login {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  background-color: #0ea5e9;
  border-radius: 10px;
  cursor: pointer;
}
</style>
