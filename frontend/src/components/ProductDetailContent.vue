<template>
  <section class="pdc" :class="`pdc--${layout}`">
    <div class="block">
      <h2 class="h">Highlights</h2>
      <ul class="highlights">
        <li v-for="(h, i) in product.highlights" :key="i">{{ h }}</li>
      </ul>
    </div>

    <div class="block">
      <h2 class="h">Specifications</h2>
      <table class="specs">
        <tbody>
          <tr v-for="s in product.specs" :key="s.label">
            <th>{{ s.label }}</th>
            <td>{{ s.value }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="block">
      <h2 class="h">Product Details</h2>
      <div
        v-for="(sec, i) in product.detailSections"
        :key="i"
        class="section"
        v-track="{ event: 'detail_section_expose', params: { id: product.id, idx: i, title: sec.title }, trigger: 'expose' }"
      >
        <h3 class="sub">{{ sec.title }}</h3>
        <img v-if="sec.image" v-lazy="sec.image" :alt="sec.title" class="sec-img" />
        <p v-for="(p, j) in sec.paragraphs" :key="j">{{ p }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Product } from '@/types';
defineProps<{ product: Product; layout?: 'pc' | 'mobile' }>();
</script>

<style scoped>
.pdc { background: #fff; border-radius: 8px; padding: 20px; margin-top: 20px; }
.pdc--mobile { padding: 12px; margin: 12px; }
.h { font-size: 18px; margin: 0 0 12px; border-left: 4px solid #ffa41c; padding-left: 8px; }
.block { margin-bottom: 24px; }
.highlights { padding-left: 20px; margin: 0; color: #333; line-height: 1.8; font-size: 14px; }
.specs { width: 100%; border-collapse: collapse; font-size: 14px; }
.specs th, .specs td { border: 1px solid #eee; padding: 8px 12px; text-align: left; }
.specs th { width: 110px; background: #fafafa; color: #555; font-weight: normal; }
.section { margin-bottom: 18px; }
.sub { font-size: 15px; margin: 0 0 8px; color: #c45500; }
.sec-img { width: 100%; border-radius: 6px; margin: 8px 0; display: block; }
.section p { line-height: 1.7; color: #333; font-size: 14px; margin: 6px 0; }
.pdc--mobile .h { font-size: 16px; }
.pdc--mobile .specs th, .pdc--mobile .specs td { padding: 6px 8px; font-size: 13px; }
</style>
