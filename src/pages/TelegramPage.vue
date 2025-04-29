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

      <div class="telegram__container">
      <h2 class="telegram__title">Login via Telegram</h2>

      <div v-if="!loggedIn" ref="telegramButton" class="telegram__button"></div>
      
      <div v-else class="telegram__result">
        <h3>👋 Welcome, {{ userData.first_name }}!</h3>
        <p>You have successfully authenticated via Telegram.</p>
      </div>
    </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const loggedIn = ref(false)
const userData = ref({})
const telegramButton = ref(null)

function handleTelegramAuth(user) {
  if (!user || !user.id) {
    console.warn('No user data received from Telegram')
    return
  }

  console.log('User authorized:', user)
  userData.value = user
  loggedIn.value = true

  fetch('/api/telegram-auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  }).catch(err => console.error('Failed to send auth to server', err))
}

onMounted(() => {
  if (!telegramButton.value) {
    console.error('Telegram button container missing')
    return
  }

  const script = document.createElement('script')
  script.src = 'https://telegram.org/js/telegram-widget.js?22'
  script.setAttribute('data-telegram-login', 'sendHiFromPortfolioBot')
  script.setAttribute('data-size', 'large')
  script.setAttribute('data-userpic', 'false')
  script.setAttribute('data-onauth', 'handleTelegramAuth') 
  script.setAttribute('data-request-access', 'write')
  script.async = true

  telegramButton.value.appendChild(script)

  window.handleTelegramAuth = handleTelegramAuth
})

onUnmounted(() => {  
  delete window.handleTelegramAuth
})
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
