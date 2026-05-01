import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { vLazy } from '@/directives/lazy';

class IO {
  cb: IntersectionObserverCallback;
  els: Element[] = [];
  constructor(cb: IntersectionObserverCallback) { this.cb = cb; }
  observe(el: Element) { this.els.push(el); }
  unobserve(el: Element) { this.els = this.els.filter((e) => e !== el); }
  disconnect() { this.els = []; }
  trigger() {
    this.cb(
      this.els.map((el) => ({ isIntersecting: true, target: el } as IntersectionObserverEntry)),
      this as unknown as IntersectionObserver,
    );
  }
}

describe('v-lazy directive', () => {
  let io: IO;
  beforeEach(() => {
    (global as any).IntersectionObserver = function (cb: IntersectionObserverCallback) {
      io = new IO(cb);
      return io;
    };
  });

  it('shows placeholder before intersect, real src after', async () => {
    const Cmp = defineComponent({
      props: ['url'],
      render() { return h('img', { 'data-test': 'img' }); },
      directives: { lazy: vLazy },
    });
    const Wrap = defineComponent({
      components: { Cmp },
      template: `<img v-lazy="url" data-test="img" />`,
      data: () => ({ url: 'https://example.com/x.jpg' }),
      directives: { lazy: vLazy },
    });
    const w = mount(Wrap);
    const img = w.find('img').element as HTMLImageElement;
    expect(img.src).toContain('data:image/svg+xml');
    io.trigger();
    expect(img.src).toBe('https://example.com/x.jpg');
  });
});
