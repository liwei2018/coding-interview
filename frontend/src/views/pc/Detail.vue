<template>
  <div class="pc-detail-wrap">
  <UiAlert v-if="loading" type="info">Loading…</UiAlert>
  <UiAlert v-else-if="fetchError" type="error">{{ fetchError }}</UiAlert>
  <template v-else-if="product">
  <div class="pc-detail" v-track="{ event: 'detail_pv', params: { id: product.id, platform: 'pc' }, trigger: 'expose' }">
    <div class="left">
      <UiImageGallery :images="product.images" :media="product.media" layout="pc" />
    </div>
    <div class="center">
      <h1 class="title" data-test="product-name">{{ product.name }}</h1>
      <p class="desc">{{ product.description }}</p>
      <div class="price-row">
        <span class="price" data-test="product-price">${{ price }}</span>
      </div>
      <UiAlert v-if="stock === 0" type="error">This SKU is sold out, please pick another option</UiAlert>
      <UiAlert v-else-if="stock < 5" type="warning">Only {{ stock }} left in stock — order soon</UiAlert>
      <UiAlert v-else type="success">In stock: {{ stock }} units</UiAlert>
      <div class="stock" data-test="product-stock">Stock: {{ stock }}</div>
      <UiSkuSelector v-model="selected" :dimensions="product.dimensions" />
    </div>
    <div class="right">
      <div class="buy-box">
        <div class="price-lg">${{ price }}</div>
        <div class="qty-row">
          <span>Qty:</span>
          <UiQuantity v-model="quantity" :min="1" :max="Math.max(1, stock)" />
        </div>
        <UiButton
          type="primary"
          :disabled="stock === 0"
          data-test="add-to-cart"
          v-track="{ event: 'add_to_cart_click', params: { id: product.id, price, qty: quantity, platform: 'pc' } }"
          @click="addToCart"
        >Add to Cart</UiButton>
        <UiButton
          type="warning"
          :disabled="stock === 0"
          v-track="{ event: 'buy_now_click', params: { id: product.id, platform: 'pc' } }"
        >Buy Now</UiButton>
        <router-link
          to="/pc/cart"
          class="cart-link"
          data-test="cart-link"
          v-track="'view_cart_click'"
        >
          View Cart ({{ cart.count }})
        </router-link>
      </div>
    </div>
  </div>
  <ProductDetailContent :product="product" layout="pc" />
  </template>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import UiImageGallery from '@/components/ui/UiImageGallery.vue';
import UiSkuSelector from '@/components/ui/UiSkuSelector.vue';
import UiButton from '@/components/ui/UiButton.vue';
import UiAlert from '@/components/ui/UiAlert.vue';
import UiQuantity from '@/components/ui/UiQuantity.vue';
import ProductDetailContent from '@/components/ProductDetailContent.vue';
import * as productApi from '@/api/product';
import { ApiError } from '@/api/types';
import { useCartStore } from '@/store/cart';
import { useToastStore } from '@/store/toast';
import type { Product, Sku, SkuSelection } from '@/types';

const route = useRoute();
const cart = useCartStore();
const toast = useToastStore();

const product = ref<Product | null>(null);
const selected = ref<SkuSelection>({});
const quantity = ref(1);
const currentSku = ref<Sku | null>(null);
const loading = ref(false);
const fetchError = ref('');

const price = computed(() => currentSku.value?.price ?? 0);
const stock = computed(() => currentSku.value?.stock ?? 0);

async function loadProduct() {
  loading.value = true;
  fetchError.value = '';
  try {
    const id = parseInt(route.query.id as string, 10) || 1;
    const data = await productApi.fetchProduct(id);
    product.value = data;
    selected.value = Object.fromEntries(data.dimensions.map((d) => [d.key, d.values[0]]));
    await refreshSku();
  } catch (e) {
    fetchError.value = e instanceof ApiError ? e.message : 'Failed to load';
  } finally {
    loading.value = false;
  }
}

async function refreshSku() {
  if (!product.value) return;
  try {
    currentSku.value = await productApi.querySku(product.value.id, selected.value);
  } catch {
    currentSku.value = null;
  }
}

watch(selected, refreshSku, { deep: true });
watch(stock, (s) => {
  if (quantity.value > s) quantity.value = Math.max(1, s);
  if (quantity.value < 1) quantity.value = 1;
});

async function addToCart() {
  if (!product.value || stock.value <= 0) {
    toast.show('This item is sold out', 'error');
    return;
  }
  const skuKey = product.value.dimensions.map((d) => selected.value[d.key]).join('-');
  try {
    await productApi.addToCart({ productId: product.value.id, skuKey, quantity: quantity.value });
    cart.addItem({
      productId: product.value.id,
      skuKey,
      name: product.value.name,
      image: product.value.images[0],
      attrs: { ...selected.value },
      price: price.value,
      stock: stock.value,
      quantity: quantity.value,
    });
    toast.show('Added to cart', 'success');
  } catch {
    /* interceptor already showed toast */
  }
}

onMounted(loadProduct);
</script>
<style scoped>
.pc-detail-wrap { max-width: 1280px; margin: 0 auto; }
.pc-detail { display: grid; grid-template-columns: 1fr 1fr 320px; gap: 24px; padding: 24px; max-width: 1280px; margin: 0 auto; }
.title { font-size: 22px; margin: 0 0 8px; }
.desc { color: #565959; font-size: 14px; }
.price { font-size: 28px; color: #b12704; font-weight: bold; }
.stock { font-size: 13px; color: #007600; margin: 8px 0 14px; }
.buy-box { border: 1px solid #d5d9d9; border-radius: 8px; padding: 16px; display: flex; flex-direction: column; gap: 12px; background: #fff; }
.price-lg { font-size: 24px; color: #b12704; font-weight: bold; }
.qty-row { display: flex; align-items: center; gap: 8px; }
.cart-link { font-size: 13px; color: #007185; text-decoration: none; text-align: center; }
</style>
