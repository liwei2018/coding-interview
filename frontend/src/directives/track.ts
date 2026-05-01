import type { Directive, DirectiveBinding } from 'vue';

export interface TrackPayload {
  event: string;
  params?: Record<string, unknown>;
  trigger?: 'click' | 'expose' | 'both';
}

type Reporter = (event: string, params: Record<string, unknown>) => void;

const defaultReporter: Reporter = (event, params) => {
  // In production, swap with sendBeacon / your analytics endpoint
  // eslint-disable-next-line no-console
  console.log('[track]', event, params);
  (window as unknown as { __track__?: Array<unknown> }).__track__ ||= [];
  (window as unknown as { __track__: Array<unknown> }).__track__.push({
    event,
    params,
    ts: Date.now(),
  });
};

let reporter: Reporter = defaultReporter;
export function setTrackReporter(fn: Reporter) {
  reporter = fn;
}

const exposed = new WeakSet<Element>();
let observer: IntersectionObserver | null = null;
const exposeMap = new WeakMap<Element, TrackPayload>();

function ensureObserver(): IntersectionObserver {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        if (exposed.has(el)) return;
        const payload = exposeMap.get(el);
        if (!payload) return;
        exposed.add(el);
        reporter(payload.event, { ...(payload.params || {}), trigger: 'expose' });
        observer!.unobserve(el);
      });
    },
    { threshold: 0.4 },
  );
  return observer;
}

function normalize(binding: DirectiveBinding): TrackPayload {
  const v = binding.value;
  if (typeof v === 'string') return { event: v, trigger: 'click' };
  return { trigger: 'click', ...(v as TrackPayload) };
}

const handlerMap = new WeakMap<Element, EventListener>();

export const vTrack: Directive<HTMLElement, TrackPayload | string> = {
  mounted(el, binding) {
    const payload = normalize(binding);
    const trig = payload.trigger || 'click';
    if (trig === 'click' || trig === 'both') {
      const onClick: EventListener = () => {
        reporter(payload.event, { ...(payload.params || {}), trigger: 'click' });
      };
      el.addEventListener('click', onClick);
      handlerMap.set(el, onClick);
    }
    if (trig === 'expose' || trig === 'both') {
      exposeMap.set(el, payload);
      if (typeof IntersectionObserver !== 'undefined') {
        ensureObserver().observe(el);
      } else {
        reporter(payload.event, { ...(payload.params || {}), trigger: 'expose' });
      }
    }
  },
  updated(el, binding) {
    if (JSON.stringify(binding.value) === JSON.stringify(binding.oldValue)) return;
    const payload = normalize(binding);
    if (exposeMap.has(el)) exposeMap.set(el, payload);
  },
  unmounted(el) {
    const h = handlerMap.get(el);
    if (h) el.removeEventListener('click', h);
    handlerMap.delete(el);
    exposeMap.delete(el);
    observer?.unobserve(el);
  },
};
