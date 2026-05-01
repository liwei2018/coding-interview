<template>
  <button
    :class="['ui-btn', `ui-btn--${type}`, { 'is-disabled': disabled }]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>
<script setup>
defineProps({
  type: { type: String, default: 'primary' },
  disabled: { type: Boolean, default: false },
});
defineEmits(['click']);
</script>
<style scoped>
.ui-btn {
  border: none;
  border-radius: 20px;
  padding: 8px 18px;
  cursor: pointer;
  font-size: 14px;
  transition: opacity 0.2s;
}
.ui-btn--primary { background: #ffd814; color: #111; }
.ui-btn--warning { background: #ffa41c; color: #111; }
.ui-btn--danger { background: #d9534f; color: #fff; }
.ui-btn--ghost { background: #f0f2f2; color: #111; }
.ui-btn.is-disabled { opacity: 0.5; cursor: not-allowed; }
</style>
