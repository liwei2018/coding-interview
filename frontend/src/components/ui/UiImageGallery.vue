<template>
  <div :class="['ui-gallery', `ui-gallery--${layout}`]">
    <div class="main" ref="mainRef">
      <!-- Placeholder keeps layout height while video is floating -->
      <div
        v-if="current.type === 'video' && floating"
        class="placeholder"
      >
        <img v-if="current.poster" :src="current.poster" alt="video-poster" />
        <button class="resume" @click="restoreVideo" data-test="gallery-restore">Back to video</button>
      </div>

      <div
        v-show="!(current.type === 'video' && floating)"
        class="media-wrap"
      >
        <video
          v-if="current.type === 'video'"
          ref="videoRef"
          :src="current.url"
          :poster="current.poster"
          controls
          playsinline
          data-test="gallery-video"
        />
        <img
          v-else
          v-lazy="current.url"
          :alt="`image-${active}`"
          data-test="gallery-main"
        />
      </div>

      <button v-if="items.length > 1" class="arrow left" @click="prev" data-test="gallery-prev">‹</button>
      <button v-if="items.length > 1" class="arrow right" @click="next" data-test="gallery-next">›</button>
    </div>

    <div class="thumbs">
      <div
        v-for="(item, i) in items"
        :key="i"
        :class="['thumb', { active: i === active }]"
        :data-test="`gallery-thumb-${i}`"
        @click="active = i"
      >
        <img v-lazy="item.type === 'video' ? (item.poster || '') : item.url" />
        <span v-if="item.type === 'video'" class="play-icon">▶</span>
      </div>
    </div>

    <!-- Floating mini video window -->
    <teleport to="body">
      <div
        v-if="current.type === 'video' && floating"
        class="floating"
        :class="`floating--${layout}`"
        data-test="gallery-floating"
      >
        <video
          ref="floatingVideoRef"
          :src="current.url"
          :poster="current.poster"
          controls
          playsinline
          autoplay
        />
        <button class="close" @click="closeFloating" data-test="gallery-floating-close">×</button>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import type { PropType } from 'vue';
import type { MediaItem } from '@/types';

const props = defineProps({
  images: { type: Array as PropType<string[]>, default: () => [] },
  media: { type: Array as PropType<MediaItem[]>, default: () => [] },
  layout: { type: String, default: 'pc' },
});

const items = computed<MediaItem[]>(() => {
  if (props.media && props.media.length) return props.media;
  return (props.images || []).map((url) => ({ type: 'image' as const, url }));
});

const active = ref(0);
const current = computed<MediaItem>(() => items.value[active.value] || { type: 'image', url: '' });

const mainRef = ref<HTMLElement | null>(null);
const videoRef = ref<HTMLVideoElement | null>(null);
const floatingVideoRef = ref<HTMLVideoElement | null>(null);

const floating = ref(false);
const userClosedFloating = ref(false);
let observer: IntersectionObserver | null = null;

watch(() => props.media, () => (active.value = 0));
watch(() => props.images, () => (active.value = 0));

watch(active, () => {
  floating.value = false;
  userClosedFloating.value = false;
});

function prev() { active.value = (active.value - 1 + items.value.length) % items.value.length; }
function next() { active.value = (active.value + 1) % items.value.length; }

function maybeFloat(visible: boolean) {
  if (current.value.type !== 'video') {
    floating.value = false;
    return;
  }
  if (userClosedFloating.value) return;
  const v = videoRef.value;
  const fv = floatingVideoRef.value;
  if (visible) {
    if (floating.value && fv) {
      // Sync floating playback time back to main video
      if (v) {
        v.currentTime = fv.currentTime;
        if (!fv.paused) v.play().catch(() => undefined);
      }
    }
    floating.value = false;
  } else {
    // Out of view: float only while playing
    if (v && !v.paused && !v.ended) {
      floating.value = true;
      nextTick(() => {
        if (floatingVideoRef.value && v) {
          floatingVideoRef.value.currentTime = v.currentTime;
          floatingVideoRef.value.play().catch(() => undefined);
        }
      });
    }
  }
}

function closeFloating() {
  userClosedFloating.value = true;
  floating.value = false;
  floatingVideoRef.value?.pause();
}

function restoreVideo() {
  mainRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

onMounted(() => {
  if (typeof IntersectionObserver === 'undefined' || !mainRef.value) return;
  observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => maybeFloat(e.isIntersecting)),
    { threshold: 0.15 },
  );
  observer.observe(mainRef.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
});
</script>

<style scoped>
.ui-gallery { display: flex; gap: 12px; }
.ui-gallery--pc { flex-direction: row-reverse; align-items: flex-start; }
.ui-gallery--pc .thumbs { flex-direction: column; }
.ui-gallery--mobile { flex-direction: column; }
.main {
  position: relative; flex: 1;
  width: 100%;
  aspect-ratio: 1 / 1;          /* Fixed 1:1 to avoid layout shift when toggling media/float */
  background: #fafafa; border-radius: 8px; overflow: hidden;
}
.media-wrap {
  position: absolute; inset: 0;
}
.media-wrap img, .media-wrap video {
  width: 100%; height: 100%;
  object-fit: contain;
  background: #000;
  border-radius: 8px; display: block; transition: opacity 0.3s;
}
.media-wrap img { background: transparent; object-fit: cover; }
.media-wrap img.lazy-loading { opacity: 0.4; }
.placeholder { position: absolute; inset: 0; border-radius: 8px; overflow: hidden; }
.placeholder img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.6); }
.placeholder .resume {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
  padding: 6px 14px; border-radius: 20px; border: none; background: #ffa41c; cursor: pointer;
}
.thumbs { display: flex; gap: 8px; }
.thumb {
  position: relative; width: 60px; height: 60px;
  border: 2px solid transparent; border-radius: 4px; cursor: pointer; overflow: hidden;
}
.thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.thumb img.lazy-loading { opacity: 0.4; }
.thumb.active { border-color: #ffa41c; }
.thumb .play-icon {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
  color: #fff; font-size: 14px; text-shadow: 0 1px 4px rgba(0,0,0,0.6);
}
.arrow {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 36px; height: 36px; border-radius: 50%; border: none;
  background: rgba(255,255,255,0.85); cursor: pointer; font-size: 22px; z-index: 1;
}
.arrow.left { left: 8px; }
.arrow.right { right: 8px; }

.floating {
  position: fixed; z-index: 9999;
  width: 280px; aspect-ratio: 16 / 10;
  background: #000; border-radius: 8px; overflow: hidden;
  box-shadow: 0 8px 30px rgba(0,0,0,0.35);
  animation: slideIn 0.25s ease-out;
}
.floating--pc { right: 20px; bottom: 20px; }
.floating--mobile { right: 12px; bottom: 80px; width: 200px; }
.floating video { width: 100%; height: 100%; object-fit: cover; display: block; background: #000; }
.floating .close {
  position: absolute; top: 4px; right: 4px;
  width: 26px; height: 26px; border-radius: 50%; border: none;
  background: rgba(0,0,0,0.55); color: #fff; cursor: pointer; font-size: 16px; line-height: 1;
}
@keyframes slideIn {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
