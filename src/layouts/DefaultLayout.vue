<template>
  <div class="layout" :class="{ 'layout--light': isLightTheme }">    
    <transition name="fade">
      <div v-if="isRouteChanging" class="layout__loading-bar"></div>
    </transition>

    <header class="layout__header" :class="{ 'layout__header--fixed': isScrolled }">
      <div class="layout__header-content">
        <h2 class="layout__title">
          <RouterLink to="/" class="layout__logo-link">
            <span class="layout__logo-text">AK</span>
            <span class="layout__full-name">Aleksei Kagan</span>
          </RouterLink>
        </h2>        
        <button 
          class="layout__mobile-menu-button" 
          @click="toggleMobileMenu"
          aria-label="Menu"
        >
          <span class="layout__burger-icon" :class="{ 'layout__burger-icon--active': isMobileMenuOpen }"></span>
        </button>        <nav 
          class="layout__nav" 
          :class="{ 'layout__nav--mobile-open': isMobileMenuOpen }"
        >
          <RouterLink 
            v-for="(link, index) in navLinks" 
            :key="index"
            :to="link.path" 
            class="layout__nav-link" 
            exact-active-class="layout__nav-link--active"
            @click="closeMobileMenu"
          >
            <span class="layout__nav-icon" v-html="link.icon"></span>
            <span class="layout__nav-text">{{ link.name }}</span>
          </RouterLink>

         
          <button @click="toggleTheme" class="layout__theme-toggle">
            <span v-if="isLightTheme" class="layout__theme-icon">
              
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </span>
            <span v-else class="layout__theme-icon">
              
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            </span>
          </button>
        </nav>
      </div>
    </header>

    <div class="layout__contact-button" :class="{ 'layout__contact-button--visible': showContactButton }">
      <a href="mailto:roscheka@gmail.com" class="layout__contact-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
        <span>Contact</span>
      </a>
    </div>

    <main class="layout__main">      
      <transition name="page" mode="out-in">
        <slot />
      </transition>
    </main>
    <footer class="layout__footer">
      <div class="layout__footer-content">
        <div class="layout__footer-info">
          <p>© {{ currentYear }} Aleksei Kagan</p>
          <p class="layout__footer-subtitle">Senior Frontend & Fullstack Developer</p>
        </div>
        <div class="layout__footer-links">
          <a href="https://linkedin.com/in/alexey-kagan" target="_blank" aria-label="LinkedIn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
          <a href="https://github.com/your-github" target="_blank" aria-label="GitHub">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>
          <a href="https://t.me/roschek" target="_blank" aria-label="Telegram">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-16.5 7.5a2.25 2.25 0 0 0 .67 4.302l16.5 7.5a2.25 2.25 0 0 0 3.052-2.118V4.535a2.242 2.242 0 0 0-2.7-2.102z"></path>
              <path d="M10.002 16.5L15.5 12l-5.5-4.5v9z"></path>
            </svg>
          </a>
        </div>
      </div>
    </footer>

    <div 
      v-if="isMobileMenuOpen" 
      class="layout__mobile-overlay" 
      @click="closeMobileMenu"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useThemeStore } from '../store/theme'

const { isLightTheme, toggleTheme, initTheme } = useThemeStore()
const navLinks = [
  { 
    name: 'Home', 
    path: '/',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>'
  },
  { 
    name: 'Frontend', 
    path: '/frontend',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>'
  },
  { 
    name: 'Telegram Bots', 
    path: '/telegram',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>'
  },
  { 
    name: 'AI Pro', 
    path: '/ai',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a9 9 0 0 1 9 9 9 9 0 0 1-9 9 9 9 0 0 1-9-9 9 9 0 0 1 9-9z"></path><path d="M9 9h6v6H9z"></path></svg>'
  },
  { 
    name: 'Code Lab', 
    path: '/codelab',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg>'
  }
]

const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)
const showContactButton = ref(false)
const isRouteChanging = ref(false)
const currentYear = computed(() => new Date().getFullYear())

const router = useRouter()



function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value  
  document.body.style.overflow = isMobileMenuOpen.value ? 'hidden' : ''
}

function closeMobileMenu() {
  if (isMobileMenuOpen.value) {
    isMobileMenuOpen.value = false
    document.body.style.overflow = ''
  }
}

function handleScroll() {
  isScrolled.value = window.scrollY > 50
  showContactButton.value = window.scrollY > 300
}

watch(() => router.currentRoute.value, () => {
 
  isRouteChanging.value = true
  
  setTimeout(() => {
    isRouteChanging.value = false
  }, 500)
  
  closeMobileMenu()
  
  window.scrollTo(0, 0)
})


onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  initTheme()
  const savedTheme = localStorage.getItem('theme')
  
  if (savedTheme) {
    isLightTheme.value = savedTheme === 'light'
  } else {    
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    isLightTheme.value = !prefersDarkMode
  }  
  document.documentElement.classList.toggle('light-theme', isLightTheme.value)
  
  handleScroll()
})


onUnmounted(() => {
  
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>

.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #0F172A;
  color: white;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.layout--light {
  background-color: #F8FAFC;
  color: #1E293B;
}

.layout__header {
  width: 100%;
  background-color: #1F2937;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  transition: all 0.3s ease;
}

.layout--light .layout__header {
  background-color: #FFFFFF;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.layout__header--fixed {
  position: fixed;
  top: 0;
  left: 0;
  animation: slideDown 0.5s;
}

.layout__header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.layout__title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
}

.layout__logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

.layout__logo-text {
  background-color: #2563EB;
  color: white;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 0.75rem;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.layout__logo-link:hover .layout__logo-text {
  transform: rotate(10deg);
  background-color: #3B82F6;
}

.layout__full-name {
  transition: color 0.3s ease;
}

.layout--light .layout__full-name {
  color: #1E293B;
}

.layout__nav {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.layout__nav-link {
  color: #CBD5E1;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  position: relative;
}

.layout--light .layout__nav-link {
  color: #64748B;
}

.layout__nav-link:hover {
  color: #38BDF8;
}

.layout--light .layout__nav-link:hover {
  color: #2563EB;
}

.layout__nav-link--active {
  color: #38BDF8;  
}

.layout--light .layout__nav-link--active {
  color: #2563EB;
}

.layout__nav-link--active::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #38BDF8;
  border-radius: 1px;
}

.layout--light .layout__nav-link--active::after {
  background-color: #2563EB;
}

.layout__nav-icon {
  display: flex;
  align-items: center;
}

.layout__theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  color: #CBD5E1;
  padding: 0.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.layout__theme-toggle:hover {
  color: #38BDF8;
  background-color: rgba(203, 213, 225, 0.1);
}

.layout--light .layout__theme-toggle {
  color: #64748B;
}

.layout--light .layout__theme-toggle:hover {
  color: #2563EB;
  background-color: rgba(100, 116, 139, 0.1);
}

.layout__theme-icon {
  display: flex;
  align-items: center;
}

.layout__mobile-menu-button {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: white;
  padding: 0.5rem;
  z-index: 110;
}

.layout__burger-icon {
  display: block;
  width: 24px;
  height: 2px;
  margin: 6px 0;
  background-color: currentColor;
  position: relative;
  transition: all 0.3s ease;
}

.layout__burger-icon::before,
.layout__burger-icon::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 2px;
  background-color: currentColor;
  transition: all 0.3s ease;
}

.layout__burger-icon::before {
  top: -8px;
}

.layout__burger-icon::after {
  bottom: -8px;
}

.layout__burger-icon--active {
  background-color: transparent;
}

.layout__burger-icon--active::before {
  top: 0;
  transform: rotate(45deg);
}

.layout__burger-icon--active::after {
  bottom: 0;
  transform: rotate(-45deg);
}

.layout__mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 90;
  backdrop-filter: blur(4px);
  transition: opacity 0.3s ease;
}

.layout__main {
  flex-grow: 1;
  margin-top: 0;
  transition: margin-top 0.3s ease;
  overflow: hidden;
}

.layout__header--fixed + .layout__main {
  margin-top: 70px;
}

.layout__footer {
  background-color: #1F2937;
  padding: 2rem 1rem;
  transition: background-color 0.3s ease;
}

.layout--light .layout__footer {
  background-color: #F1F5F9;
}

.layout__footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.layout__footer-info {
  color: #CBD5E1;
}

.layout--light .layout__footer-info {
  color: #64748B;
}

.layout__footer-subtitle {
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.layout__footer-links {
  display: flex;
  gap: 1.5rem;
}

.layout__footer-links a {
  color: #94A3B8;
  transition: color 0.3s ease, transform 0.3s ease;
  display: flex;
}

.layout__footer-links a:hover {
  color: #38BDF8;
  transform: translateY(-3px);
}

.layout--light .layout__footer-links a:hover {
  color: #2563EB;
}

.layout__contact-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  transform: scale(0);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 50;
}

.layout__contact-button--visible {
  transform: scale(1);
}

.layout__contact-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #2563EB;
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 2rem;
  text-decoration: none;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  transition: all 0.3s ease;
}

.layout__contact-link:hover {
  background-color: #1D4ED8;
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
}


.layout__loading-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 100%;
  background: linear-gradient(to right, #2563EB, #38BDF8);
  z-index: 1000;
  animation: loading 1s infinite linear;
}

.layout__mobile-menu-button {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: white; 
  padding: 0.5rem;
  z-index: 110;
}

.layout--light .layout__mobile-menu-button {
  color: #1E293B;
}

.layout__burger-icon {
  display: block;
  width: 24px;
  height: 2px;
  margin: 6px 0;
  background-color: currentColor;
  position: relative;
  transition: all 0.3s ease;
}

.layout__burger-icon::before,
.layout__burger-icon::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 2px;
  background-color: currentColor;
  transition: all 0.3s ease;
}

.layout__burger-icon::before {
  top: -8px;
}

.layout__burger-icon::after {
  bottom: -8px;
}

.layout__burger-icon--active {
  background-color: transparent;
}

.layout__burger-icon--active::before {
  top: 0;
  transform: rotate(45deg);
}

.layout__burger-icon--active::after {
  bottom: 0;
  transform: rotate(-45deg);
}

.layout__mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 90;
  backdrop-filter: blur(4px);
  transition: opacity 0.3s ease;
}

.layout--light .layout__mobile-overlay {
  background-color: rgba(0, 0, 0, 0.3);
}

.layout__modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #94A3B8;
  cursor: pointer;
  transition: color 0.2s ease;
  display: flex;
}

.layout--light .layout__modal-close {
  color: #475569;
}

.layout__modal-close:hover {
  color: white;
}

.layout--light .layout__modal-close:hover {
  color: #1E293B;
}
@keyframes slideDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes loading {
  0% {
    background-position: 0% 0;
  }
  100% {
    background-position: 100% 0;
  }
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .layout__mobile-menu-button {
    display: block;
  }
  
  .layout__nav {
    position: fixed;
    top: 0;
    right: -100%;
    width: 70%;
    max-width: 300px;
    height: 100vh;
    background-color: #1E293B;
    flex-direction: column;
    justify-content: flex-start;
    padding: 5rem 2rem 2rem;
    z-index: 100;
    transition: right 0.3s ease;
    gap: 2rem;
    overflow-y: auto;
  }
  
  .layout--light .layout__nav {
    background-color: #FFFFFF;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  }
  
  .layout__nav--mobile-open {
    right: 0;
  }
  
  .layout__nav-link {
    width: 100%;
    padding: 1rem;
    border-radius: 0.5rem;
  }
  
  .layout__nav-link--active::after {
    display: none;
  }
  
  .layout__nav-link--active {
    background-color: rgba(56, 189, 248, 0.1);
  }
  
  .layout--light .layout__nav-link--active {
    background-color: rgba(37, 99, 235, 0.1);
  }
  
  .layout__full-name {
    display: none;
  }
  
  .layout__footer-content {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
  
  .layout__contact-button {
    bottom: 1.5rem;
    right: 1.5rem;
  }
  
  .layout__contact-link span {
    display: none;
  }
  
  .layout__contact-link {
    padding: 1rem;
    border-radius: 50%;
  }
}

@media (max-width: 480px) {
  .layout__header-content {
    padding: 1rem;
  }
  
  .layout__logo-text {
    width: 2rem;
    height: 2rem;
    font-size: 0.875rem;
  }
}
</style>