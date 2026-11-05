<template>
  <router-view v-if="route.meta.bare" />
  <DefaultLayout v-else>
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </DefaultLayout>
</template>

<script setup>
import { useRoute } from 'vue-router'
import DefaultLayout from './layouts/DefaultLayout.vue'

const route = useRoute()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
