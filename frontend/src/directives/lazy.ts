import type { Directive } from 'vue';

const PLACEHOLDER =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><rect width="1" height="1" fill="%23eaeded"/></svg>';

let observer: IntersectionObserver | null = null;
const map = new WeakMap<Element, string>();

function ensureObserver(): IntersectionObserver {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLImageElement;
        const src = map.get(el);
        if (src) {
          el.src = src;
          el.classList.add('lazy-loading');
          el.addEventListener(
            'load',
            () => {
              el.classList.remove('lazy-loading');
              el.classList.add('lazy-loaded');
            },
            { once: true },
          );
        }
        observer!.unobserve(el);
      });
    },
    { rootMargin: '100px 0px', threshold: 0.01 },
  );
  return observer;
}

export const vLazy: Directive<HTMLImageElement, string> = {
  mounted(el, binding) {
    el.src = PLACEHOLDER;
    map.set(el, binding.value);
    if (typeof IntersectionObserver === 'undefined') {
      el.src = binding.value;
      return;
    }
    ensureObserver().observe(el);
  },
  updated(el, binding) {
    if (binding.value === binding.oldValue) return;
    map.set(el, binding.value);
    el.src = PLACEHOLDER;
    el.classList.remove('lazy-loaded');
    if (typeof IntersectionObserver === 'undefined') {
      el.src = binding.value;
      return;
    }
    ensureObserver().observe(el);
  },
  unmounted(el) {
    observer?.unobserve(el);
    map.delete(el);
  },
};
