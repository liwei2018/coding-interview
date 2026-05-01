<template>
  <div class="m-cart">
    <h1>Cart ({{ cart.count }})</h1>
    <UiAlert v-if="cart.items.length === 0" type="info">Your cart is empty</UiAlert>
    <div v-else class="list">
      <div v-for="item in cart.items" :key="item.key" class="row" data-test="cart-row">
        <img v-lazy="item.image" />
        <div class="info">
          <div class="name">{{ item.name }}</div>
          <div class="attrs">
            <span v-for="(v, k) in item.attrs" :key="k">{{ k }}:{{ v }}</span>
          </div>
          <div class="line">
            <span class="price">${{ item.price * item.quantity }}</span>
            <UiQuantity
              :model-value="item.quantity"
              :min="0"
              :max="item.stock"
              data-test="cart-qty"
              @update:model-value="(v) => onQtyChange(item.key, v)"
            />
          </div>
          <div class="line">
            <span class="hint">Decrease to 0 to remove</span>
            <UiButton type="danger" data-test="remove-btn" @click="confirmRemove(item.key)">Remove</UiButton>
          </div>
        </div>
      </div>
    </div>
    <div v-if="cart.items.length" class="total" data-test="cart-total">Total ${{ cart.totalPrice }}</div>
  </div>
</template>
<script setup lang="ts">
import { useCartStore } from '@/store/cart';
import { useToastStore } from '@/store/toast';
import UiButton from '@/components/ui/UiButton.vue';
import UiAlert from '@/components/ui/UiAlert.vue';
import UiQuantity from '@/components/ui/UiQuantity.vue';
const cart = useCartStore();
const toast = useToastStore();

function onQtyChange(key: string, v: number) {
  if (v <= 0) {
    cart.removeItem(key);
    toast.show('Removed', 'success');
    return;
  }
  cart.updateQuantity(key, v);
}

function confirmRemove(key: string) {
  if (window.confirm('Remove this item from your cart?')) {
    cart.removeItem(key);
    toast.show('Removed', 'success');
  }
}
</script>
<style scoped>
.m-cart { max-width: 480px; margin: 0 auto; padding: 12px; background: #f6f6f6; min-height: 100vh; }
h1 { font-size: 18px; margin: 8px 0 12px; }
.row { display: flex; gap: 10px; background: #fff; padding: 10px; border-radius: 8px; margin-bottom: 10px; }
.row img { width: 80px; height: 80px; border-radius: 6px; object-fit: cover; }
.info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.name { font-size: 14px; }
.attrs span { display: inline-block; margin-right: 6px; color: #888; font-size: 12px; }
.line { display: flex; align-items: center; justify-content: space-between; margin-top: auto; }
.price { color: #b12704; font-weight: bold; }
.hint { font-size: 11px; color: #999; }
.total { text-align: right; padding: 10px; font-weight: bold; color: #b12704; }
</style>
