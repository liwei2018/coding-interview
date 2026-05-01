<template>
  <div class="pc-cart">
    <h1>Cart ({{ cart.count }} items)</h1>
    <UiAlert v-if="cart.items.length === 0" type="info">Your cart is empty. Go pick something nice.</UiAlert>
    <table v-else class="tbl">
      <thead>
        <tr><th>Product</th><th>Variant</th><th>Price</th><th>Quantity</th><th>Subtotal</th><th>Action</th></tr>
      </thead>
      <tbody>
        <tr v-for="item in cart.items" :key="item.key" data-test="cart-row">
          <td>
            <div class="prod">
              <img v-lazy="item.image" />
              <span>{{ item.name }}</span>
            </div>
          </td>
          <td>
            <span v-for="(v, k) in item.attrs" :key="k" class="attr">{{ k }}: {{ v }}</span>
          </td>
          <td>${{ item.price }}</td>
          <td>
            <UiQuantity
              :model-value="item.quantity"
              :min="0"
              :max="item.stock"
              data-test="cart-qty"
              @update:model-value="(v) => onQtyChange(item.key, v)"
            />
          </td>
          <td class="sub">${{ item.price * item.quantity }}</td>
          <td>
            <UiButton type="danger" data-test="remove-btn" @click="confirmRemove(item.key)">Remove</UiButton>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="cart.items.length" class="total" data-test="cart-total">
      Total: <span class="num">${{ cart.totalPrice }}</span>
    </div>
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
    toast.show('Item removed from cart', 'success');
    return;
  }
  cart.updateQuantity(key, v);
}

function confirmRemove(key: string) {
  if (window.confirm('Remove this item from your cart?')) {
    cart.removeItem(key);
    toast.show('Item removed from cart', 'success');
  }
}
</script>
<style scoped>
.pc-cart { max-width: 1100px; margin: 0 auto; padding: 24px; }
h1 { font-size: 22px; }
.tbl { width: 100%; border-collapse: collapse; background: #fff; }
.tbl th, .tbl td { border-bottom: 1px solid #eee; padding: 12px; text-align: left; font-size: 14px; }
.prod { display: flex; align-items: center; gap: 10px; }
.prod img { width: 60px; height: 60px; border-radius: 4px; object-fit: cover; }
.attr { display: inline-block; margin-right: 8px; color: #565959; font-size: 12px; }
.sub { color: #b12704; font-weight: bold; }
.total { text-align: right; padding: 16px; font-size: 16px; }
.total .num { color: #b12704; font-size: 22px; font-weight: bold; }
</style>
