<template>
  <div :class="['ui-alert', `ui-alert--${type}`]" data-test="ui-alert">
    <slot />
  </div>
</template>
<script setup>
defineProps({ type: { type: String, default: 'info' } });
</script>
<style scoped>
.ui-alert { padding: 8px 12px; border-radius: 4px; font-size: 13px; }
.ui-alert--info { background: #e7f3fe; color: #084c8d; }
.ui-alert--warning { background: #fff8e1; color: #8a6d00; }
.ui-alert--error { background: #fde7e9; color: #a8071a; }
.ui-alert--success { background: #e6ffed; color: #135200; }
</style>
