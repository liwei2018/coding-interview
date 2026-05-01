import { mount } from '@vue/test-utils';
import UiQuantity from '@/components/ui/UiQuantity.vue';

describe('UiQuantity', () => {
  it('clamps value to max', async () => {
    const w = mount(UiQuantity, { props: { modelValue: 5, min: 1, max: 5 } });
    await w.find('[data-test="qty-plus"]').trigger('click');
    // already at max, no emission
    expect(w.emitted('update:modelValue')).toBeFalsy();
  });

  it('decrements when above min', async () => {
    const w = mount(UiQuantity, { props: { modelValue: 3, min: 1, max: 10 } });
    await w.find('[data-test="qty-minus"]').trigger('click');
    expect(w.emitted('update:modelValue')[0]).toEqual([2]);
  });

  it('clamps user typed value', async () => {
    const w = mount(UiQuantity, { props: { modelValue: 1, min: 1, max: 5 } });
    await w.find('[data-test="qty-input"]').setValue('99');
    expect(w.emitted('update:modelValue')[0]).toEqual([5]);
  });
});
