<template>
  <transition name="fade">
    <div v-if="toast.visible" :class="['ui-toast', `ui-toast--${toast.type}`]" data-test="ui-toast">
      {{ toast.message }}
    </div>
  </transition>
</template>
<script setup>
import { useToastStore } from '@/store/toast';
const toast = useToastStore();
</script>
<style scoped>
.ui-toast {
  position: fixed;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  border-radius: 6px;
  color: #fff;
  z-index: 999;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.ui-toast--success { background: #52c41a; }
.ui-toast--warning { background: #faad14; }
.ui-toast--error { background: #ff4d4f; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
</style>
