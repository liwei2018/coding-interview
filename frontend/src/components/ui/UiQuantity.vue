<template>
  <div class="ui-qty">
    <button :disabled="modelValue <= min" @click="update(modelValue - 1)" data-test="qty-minus">-</button>
    <input
      type="number"
      :value="modelValue"
      :min="min"
      :max="max"
      data-test="qty-input"
      @input="onInput"
    />
    <button :disabled="modelValue >= max" @click="update(modelValue + 1)" data-test="qty-plus">+</button>
  </div>
</template>
<script setup>
const props = defineProps({
  modelValue: { type: Number, required: true },
  min: { type: Number, default: 1 },
  max: { type: Number, default: 99 },
});
const emit = defineEmits(['update:modelValue']);
function update(v) {
  if (Number.isNaN(v)) v = props.min;
  v = Math.max(props.min, Math.min(props.max, v));
  emit('update:modelValue', v);
}
function onInput(e) { update(parseInt(e.target.value, 10)); }
</script>
<style scoped>
.ui-qty { display: inline-flex; align-items: center; border: 1px solid #d5d9d9; border-radius: 6px; overflow: hidden; }
.ui-qty button { width: 32px; height: 32px; border: none; background: #f0f2f2; cursor: pointer; font-size: 16px; }
.ui-qty button:disabled { opacity: 0.4; cursor: not-allowed; }
.ui-qty input { width: 48px; height: 32px; border: none; text-align: center; outline: none; }
</style>
