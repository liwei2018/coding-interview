<template>
  <UiAlert v-if="loading" type="info">Loading…</UiAlert>
  <UiAlert v-else-if="fetchError" type="error">{{ fetchError }}</UiAlert>
  <div v-else-if="product" class="m-detail" v-track="{ event: 'detail_pv', params: { id: product.id, platform: 'mobile' }, trigger: 'expose' }">
    <UiImageGallery :images="product.images" :media="product.media" layout="mobile" />
    <div class="info">
      <div class="price-row">
        <span class="price" data-test="product-price">${{ price }}</span>
      </div>
      <h1 class="title" data-test="product-name">{{ product.name }}</h1>
      <p class="desc">{{ product.description }}</p>
      <UiAlert v-if="stock === 0" type="error">Sold out</UiAlert>
      <UiAlert v-else-if="stock < 5" type="warning">Only {{ stock }} left</UiAlert>
      <div class="stock" data-test="product-stock">Stock: {{ stock }}</div>
      <UiSkuSelector v-model="selected" :dimensions="product.dimensions" />
      <div class="qty-row">
        <span>Qty</span>
        <UiQuantity v-model="quantity" :min="1" :max="Math.max(1, stock)" />
      </div>
    </div>
    <ProductDetailContent :product="product" layout="mobile" />
    <div class="bottom-bar">
      <router-link to="/mobile/cart" class="cart-icon" data-test="cart-link">
        🛒<span class="badge" v-if="cart.count">{{ cart.count }}</span>
      </router-link>
      <UiButton
        type="warning"
        :disabled="stock === 0"
        data-test="add-to-cart"
        v-track="{ event: 'add_to_cart_click', params: { id: product.id, price, qty: quantity, platform: 'mobile' } }"
        @click="addToCart"
      >Add to Cart</UiButton>
      <UiButton
        type="primary"
        :disabled="stock === 0"
        v-track="{ event: 'buy_now_click', params: { id: product.id, platform: 'mobile' } }"
      >Buy Now</UiButton>
    </div>
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
.m-detail { max-width: 480px; margin: 0 auto; padding-bottom: 80px; background: #fff; }
.info { padding: 12px; }
.price { font-size: 22px; color: #b12704; font-weight: bold; }
.title { font-size: 16px; margin: 8px 0; }
.desc { color: #565959; font-size: 13px; }
.stock { font-size: 12px; color: #007600; margin: 6px 0; }
.qty-row { display: flex; align-items: center; gap: 10px; margin-top: 12px; font-size: 14px; }
.bottom-bar {
  position: fixed; left: 0; right: 0; bottom: 0;
  display: flex; align-items: center; gap: 8px; padding: 8px;
  background: #fff; border-top: 1px solid #eee; max-width: 480px; margin: 0 auto;
}
.cart-icon { position: relative; font-size: 24px; padding: 0 8px; text-decoration: none; }
.badge {
  position: absolute; top: -4px; right: -4px; background: #b12704; color: #fff;
  font-size: 11px; border-radius: 10px; padding: 0 5px; min-width: 16px; text-align: center;
}
</style>
