import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ProgressWidget from '@/components/widgets/common/ProgressWidget.vue';
import { useGlobalStore } from '@/stores/globalStore';

const { resetViewPort } = vi.hoisted(() => ({
  resetViewPort: vi.fn((isSmallViewPort: { value: boolean }) => {
    isSmallViewPort.value = window.innerWidth <= 960;
  }),
}));

vi.mock('@/utilities/common', () => ({
  default: () => ({ resetViewPort }),
}));

const vuetify = createVuetify({
  components,
  directives,
});

const ProgressCircularStub = defineComponent({
  name: 'VProgressCircular',
  props: {
    size: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    return () =>
      h('div', {
        class: 'v-progress-circular',
        'data-size': props.size,
      });
  },
});

describe('ProgressWidget.vue', () => {
  let pinia: ReturnType<typeof createPinia>;
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    pinia = createPinia();
    setActivePinia(pinia);
    setWindowWidth(800);
  });

  afterEach(() => {
    wrapper?.unmount();
    vi.useRealTimers();
  });

  const setWindowWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: width,
    });
  };

  const mountWidget = () =>
    mount(ProgressWidget, {
      global: {
        plugins: [pinia, vuetify],
        stubs: {
          VProgressCircular: ProgressCircularStub,
        },
      },
    });

  const configureCancel = (delay: number | null = 1000) => {
    useGlobalStore().updateCancelApiRequestDelegate(vi.fn(), delay);
  };

  it('renders the mobile progress indicator and uses the smallest size below 600px', () => {
    setWindowWidth(500);
    wrapper = mountWidget();

    expect(wrapper.find('.mobile-progress-container').exists()).toBe(true);
    expect(wrapper.find('.desktop-progress-container').exists()).toBe(false);
    expect(wrapper.find('.v-progress-linear').exists()).toBe(true);
    expect(wrapper.find('.loading-message').text()).toContain(
      'working, please do not navigate away',
    );
    expect(wrapper.find('.v-progress-circular').exists()).toBe(false);
  });

  it.each([
    [500, 150],
    [600, 200],
    [960, 250],
    [1920, 250],
    [1921, 300],
  ])('renders the expected indicator for viewport width %i', (width, expectedSize) => {
    setWindowWidth(width);
    wrapper = mountWidget();

    expect(Reflect.get(wrapper.vm, 'progressSize')).toBe(expectedSize);

    if (width < 1921) {
      expect(wrapper.find('.mobile-progress-container').exists()).toBe(true);
      expect(wrapper.find('.v-progress-linear').exists()).toBe(true);
    } else {
      expect(wrapper.find('.desktop-progress-container').exists()).toBe(true);
      expect(wrapper.find('.v-progress-circular').exists()).toBe(true);
      expect(wrapper.find('.v-progress-circular').attributes('data-size')).toBe(
        String(expectedSize),
      );
    }

    expect(resetViewPort).toHaveBeenCalled();
  });

  it('provides a hidden mobile cancel placeholder until the delay expires', async () => {
    vi.useFakeTimers();
    setWindowWidth(500);
    configureCancel(1000);
    wrapper = mountWidget();

    expect(wrapper.find('.mobile-cancel-button').attributes('style')).toContain(
      'visibility: hidden',
    );
    expect(wrapper.find('.mobile-cancel-button .v-btn').exists()).toBe(true);

    await vi.advanceTimersByTimeAsync(1000);
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.mobile-cancel-button').attributes('style')).toBeUndefined();
    expect(wrapper.find('.mobile-cancel-button .v-btn').text()).toContain('Cancel');
  });

  it('provides a hidden desktop cancel placeholder until the default delay expires', async () => {
    vi.useFakeTimers();
    setWindowWidth(2000);
    const cancelDelegate = vi.fn();
    useGlobalStore().updateCancelApiRequestDelegate(cancelDelegate, null);
    wrapper = mountWidget();

    expect(wrapper.find('.desktop-progress-container').exists()).toBe(true);
    expect(wrapper.find('.progress-button').attributes('style')).toContain('visibility: hidden');

    await vi.advanceTimersByTimeAsync(59_999);
    expect(wrapper.find('.progress-button').attributes('style')).toContain('visibility: hidden');

    await vi.advanceTimersByTimeAsync(1);
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.progress-button').attributes('style')).toBeUndefined();
    expect(wrapper.find('.progress-button .v-btn').text()).toContain('Cancel');
    await wrapper.find('.progress-button .v-btn').trigger('click');
    expect(cancelDelegate).toHaveBeenCalledOnce();
  });

  it('does not render a cancel control without a cancel delegate', () => {
    setWindowWidth(2000);
    wrapper = mountWidget();

    expect(wrapper.find('.progress-button').exists()).toBe(false);
    expect(wrapper.find('.mobile-cancel-button').exists()).toBe(false);
  });

  it('invokes the cancel delegate when the visible cancel button is clicked', async () => {
    vi.useFakeTimers();
    setWindowWidth(500);
    const cancelDelegate = vi.fn();
    useGlobalStore().updateCancelApiRequestDelegate(cancelDelegate, 1);
    wrapper = mountWidget();

    await vi.advanceTimersByTimeAsync(1);
    await wrapper.vm.$nextTick();
    await wrapper.find('.mobile-cancel-button .v-btn').trigger('click');

    expect(cancelDelegate).toHaveBeenCalledOnce();
  });

  it('updates viewport sizing after resize and runs unmount cleanup callback', async () => {
    const addEventListener = vi.spyOn(window, 'addEventListener');
    const removeEventListener = vi.spyOn(window, 'removeEventListener');
    setWindowWidth(800);
    wrapper = mountWidget();

    const resizeHandler = addEventListener.mock.calls.find(([eventName]) => eventName === 'resize')?.[1];
    expect(resizeHandler).toBeDefined();

    setWindowWidth(2000);
    if (typeof resizeHandler === 'function') {
      resizeHandler(new Event('resize'));
    }
    await wrapper.vm.$nextTick();
    expect(resetViewPort).toHaveBeenCalledTimes(2);
    expect(wrapper.find('.desktop-progress-container').exists()).toBe(true);

    wrapper.unmount();

    const cleanupHandler = removeEventListener.mock.calls.find(
      ([eventName]) => eventName === 'resize',
    )?.[1];
    expect(cleanupHandler).toBeDefined();
    if (typeof cleanupHandler === 'function') {
      cleanupHandler(new Event('resize'));
    }
    expect(resetViewPort).toHaveBeenCalledTimes(2);

    addEventListener.mockRestore();
    removeEventListener.mockRestore();
  });
});