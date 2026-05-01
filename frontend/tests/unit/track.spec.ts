import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { vTrack, setTrackReporter } from '@/directives/track';

describe('v-track directive', () => {
  const events: Array<{ event: string; params: Record<string, unknown> }> = [];
  beforeEach(() => {
    events.length = 0;
    setTrackReporter((event, params) => events.push({ event, params }));
  });

  it('reports on click with object payload', async () => {
    const Cmp = defineComponent({
      template: `<button v-track="{ event: 'btn_click', params: { id: 1 } }">go</button>`,
      directives: { track: vTrack },
    });
    const w = mount(Cmp);
    await w.find('button').trigger('click');
    expect(events).toHaveLength(1);
    expect(events[0].event).toBe('btn_click');
    expect(events[0].params).toMatchObject({ id: 1, trigger: 'click' });
  });

  it('accepts string shorthand', async () => {
    const Cmp = defineComponent({
      template: `<a v-track="'view_cart'">x</a>`,
      directives: { track: vTrack },
    });
    const w = mount(Cmp);
    await w.find('a').trigger('click');
    expect(events[0].event).toBe('view_cart');
  });
});
