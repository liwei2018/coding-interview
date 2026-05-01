<template>
  <div class="app">
    <nav class="nav">
      <router-link to="/pc/detail?id=1">PC Detail</router-link>
      <router-link to="/pc/cart">PC Cart</router-link>
      <router-link to="/mobile/detail?id=1">Mobile Detail</router-link>
      <router-link to="/mobile/cart">Mobile Cart</router-link>
    </nav>
    <router-view />
    <UiToast />
  </div>
</template>
<script setup>
import UiToast from '@/components/ui/UiToast.vue';
</script>
<style scoped>
.nav { display: flex; gap: 12px; padding: 10px; background: #232f3e; }
.nav a { color: #fff; text-decoration: none; font-size: 14px; }
.nav a.router-link-active { color: #ffa41c; }
</style>
