<template>
  <section class="bg-[#0F172A] text-white  flex-1 px-8  mt-10">
    <div class="max-w-4xl mx-auto">
      <h2 class="text-4xl font-bold mb-8 text-center">Telegram Bots Projects</h2>

      <p class="text-lg text-gray-400 mb-12 text-center">
        I create smart, reliable, and scalable Telegram bots to automate tasks, provide services, and connect with
        users.
      </p>

      <div class="bg-gray-800 rounded-lg p-6 shadow-lg">
        <div class="h-80 overflow-y-auto p-4 bg-gray-900 rounded-lg mb-4" ref="chatBox">
          <div v-for="(message, index) in messages" :key="index"
            :class="message.isBot ? 'text-blue-400' : 'text-green-400'" class="mb-2">
            <span class="font-semibold">{{ message.isBot ? 'Bot' : 'You' }}:</span> {{ message.text }}
          </div>
        </div>

        <form @submit.prevent="sendMessage" class="flex gap-4">
          <input v-model="input" type="text" placeholder="Type a message..."
            class="flex-grow p-3 rounded-lg text-black text-white" />
          <button type="submit" class="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg">
            Send
          </button>
        </form>
      </div>
    </div>
    <div id="telegram-login" class="flex justify-center items-center bg-blue-500 rounded-lg shadow-md w-[300px] h-16 mx-auto mt-12 transform hover:scale-105 transition duration-300">
</div>
  </section>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'

onMounted(() => {
  const script = document.createElement('script');
  script.src = 'https://telegram.org/js/telegram-widget.js?22';
  script.setAttribute('data-telegram-login', 'sendHiFromPortfolioBot');
  script.setAttribute('data-size', 'large');
  script.setAttribute('data-auth-url', '/api/telegram-auth');
  script.setAttribute('data-request-access', 'write');
  script.async = true;
  document.getElementById('telegram-login').appendChild(script);
});
const input = ref('')
const messages = ref([
  { text: 'Hello! I am your Telegram assistant 🤖', isBot: true }
])

const chatBox = ref(null)

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
