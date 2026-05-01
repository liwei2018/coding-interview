<template>
  <div class="ui-sku">
    <div v-for="dim in dimensions" :key="dim.key" class="dim">
      <div class="label">{{ dim.name }}: <span class="cur">{{ modelValue[dim.key] }}</span></div>
      <div class="values">
        <button
          v-for="val in dim.values"
          :key="val"
          :class="['val', { active: modelValue[dim.key] === val }]"
          :data-test="`sku-${dim.key}-${val}`"
          @click="select(dim.key, val)"
        >
          {{ val }}
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  dimensions: { type: Array, required: true },
  modelValue: { type: Object, required: true },
});
const emit = defineEmits(['update:modelValue']);
function select(key, val) {
  emit('update:modelValue', { ...props.modelValue, [key]: val });
}
</script>
<style scoped>
.dim { margin-bottom: 14px; }
.label { font-size: 14px; margin-bottom: 6px; }
.cur { font-weight: bold; color: #c45500; }
.values { display: flex; flex-wrap: wrap; gap: 8px; }
.val {
  padding: 6px 14px; border: 1px solid #d5d9d9; background: #fff;
  border-radius: 6px; cursor: pointer; font-size: 13px;
}
.val.active { border-color: #ffa41c; background: #fff7e6; color: #c45500; }
</style>
