/// <reference types="vite/client" />
import { mount } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { describe, expect, it, vi } from 'vitest';
import GaugeWidget from '@/components/widgets/admin/GaugeWidget.vue';
import gaugeSource from '@/components/widgets/admin/GaugeWidget.vue?raw';
import { parse } from 'vue/compiler-sfc';

const vuetify = createVuetify({
  components,
  directives,
});

describe('GaugeWidget.vue', () => {
  const mountWidget = (props: { labelProp?: string; valueProp?: number } = {}) =>
    mount(GaugeWidget, {
      props,
      global: {
        plugins: [vuetify],
      },
    });

  it('uses default props and renders the gauge paths', () => {
    const wrapper = mountWidget();

    expect(wrapper.find('svg').attributes('aria-label')).toBe('0 ');
    expect(wrapper.find('.v-card-title').text()).toBe('0');
    expect(wrapper.find('.gauge-track').attributes('d')).toMatch(
      /^M .* A 75 75 0 1 1 .*$/,
    );
    expect(wrapper.find('.gauge-value').attributes('d')).toMatch(
      /^M .* A 75 75 0 0 1 .*$/,
    );
  });

  it.each([
    [0, 10],
    [10, 10],
    [11, 50],
    [50, 50],
    [51, 100],
    [100, 100],
    [101, 500],
    [500, 500],
    [501, 1_000],
    [1_000, 1_000],
    [1_001, 5_000],
    [5_000, 5_000],
    [5_001, 10_000],
    [10_000, 10_000],
    [10_001, 50_000],
    [50_000, 50_000],
    [50_001, 100_000],
    [100_000, 100_000],
    [100_001, 500_000],
    [500_000, 500_000],
    [500_001, 1_000_000],
    [1_000_000, 1_000_000],
    [1_000_001, 2_000_000],
  ])('scales value %i against maximum %i', (value, maximum) => {
    const wrapper = mountWidget({ labelProp: 'Users', valueProp: value });

    expect(wrapper.find('svg').attributes('aria-label')).toBe(`${value} Users`);
    expect(wrapper.find('.v-card-title').text()).toBe(`${value} Users`);
    expect(wrapper.get('[role="slider"]').attributes('aria-valuenow')).toBe(String(value));
    expect(wrapper.get('[role="slider"]').attributes('aria-valuemax')).toBe(String(maximum));

    const valuePath = wrapper.find('.gauge-value').attributes('d');
    const fullPath = wrapper.find('.gauge-track').attributes('d');
    if (value === maximum) {
      expect(valuePath).toBe(fullPath);
    } else {
      expect(valuePath).not.toBe(fullPath);
    }
  });

  it('clamps negative values to zero progress', () => {
    const wrapper = mountWidget({ labelProp: 'Games', valueProp: -5 });

    expect(wrapper.find('svg').attributes('aria-label')).toBe('-5 Games');
    expect(wrapper.find('.gauge-value').attributes('d')).toMatch(
      /^M .* A 75 75 0 0 1 .*$/,
    );
    expect(wrapper.get('[role="slider"]').attributes('aria-valuenow')).toBe('0');
  });

  it('sets the large-arc flag when progress exceeds the halfway point of the gauge', () => {
    const wrapper = mountWidget({ labelProp: 'Apps', valueProp: 9 });

    expect(wrapper.find('.gauge-value').attributes('d')).toMatch(
      /^M .* A 75 75 0 1 1 .*$/,
    );
  });

  it('reacts to prop updates', async () => {
    const consoleError = vi.spyOn(console, 'error');
    const wrapper = mountWidget({ labelProp: 'Users', valueProp: 4 });
    const initialPath = wrapper.find('.gauge-value').attributes('d');

    try {
      await wrapper.setProps({ labelProp: 'Games', valueProp: 11 });

      expect(wrapper.find('svg').attributes('aria-label')).toBe('11 Games');
      expect(wrapper.find('.gauge-value').attributes('d')).not.toBe(initialPath);
      expect(wrapper.get('[role="slider"]').attributes('aria-valuenow')).toBe('11');
      expect(wrapper.get('[role="slider"]').attributes('aria-valuemax')).toBe('50');

      await wrapper.setProps({ valueProp: 4 });
      expect(wrapper.get('[role="slider"]').attributes('aria-valuenow')).toBe('4');
      expect(wrapper.get('[role="slider"]').attributes('aria-valuemax')).toBe('10');

      await wrapper.setProps({ valueProp: 9 });
      expect(wrapper.get('[role="slider"]').attributes('aria-valuenow')).toBe('9');
      expect(wrapper.get('[role="slider"]').attributes('aria-valuemax')).toBe('10');
      expect(consoleError).not.toHaveBeenCalled();
    } finally {
      consoleError.mockRestore();
    }
  });

  it('keeps the slider read-only and out of the tab order', async () => {
    const wrapper = mountWidget({ labelProp: 'Users', valueProp: 4 });
    const slider = wrapper.get('.vue-slider');
    const dot = wrapper.get('[role="slider"]');

    expect(slider.classes()).toContain('vue-slider-disabled');
    expect(wrapper.get('.gauge-slider').attributes('aria-hidden')).toBe('true');
    expect(dot.attributes('tabindex')).toBe('-1');

    await slider.trigger('click');
    await dot.trigger('focus');
    await dot.trigger('keydown', { key: 'ArrowRight' });

    expect(dot.attributes('aria-valuenow')).toBe('4');
    expect(wrapper.get('.v-card-title').text()).toBe('4 Users');
  });

  it('declares slider and card styles for screens at 440px and below', () => {
    const wrapper = mountWidget();
    const style = document.createElement('style');
    style.textContent = parse(gaugeSource).descriptor.styles[0].content;
    document.head.appendChild(style);

    try {
      const rules = Array.from(style.sheet!.cssRules);
      const sliderRule = rules.find(
        (rule): rule is CSSStyleRule =>
          rule instanceof CSSStyleRule && rule.selectorText === '.gauge-slider',
      );
      const mobileRule = rules.find(
        (rule): rule is CSSMediaRule =>
          rule instanceof CSSMediaRule && rule.conditionText === 'only screen and (max-width: 440px)',
      );
      expect(sliderRule?.style.display).toBe('none');
      expect(mobileRule).toBeDefined();
      const widerRuleIndex = rules.findIndex(
        (rule) =>
          rule instanceof CSSMediaRule &&
          rule.conditionText === 'only screen and (min-width: 431px) and (max-width: 600px)',
      );
      expect(widerRuleIndex).toBeGreaterThanOrEqual(0);
      expect(rules.indexOf(mobileRule!)).toBeGreaterThan(widerRuleIndex);

      const mobileRules = Array.from(mobileRule!.cssRules);
      const chartRule = mobileRules.find(
        (rule): rule is CSSStyleRule =>
          rule instanceof CSSStyleRule && rule.selectorText === '.gauge-chart',
      );
      const mobileSliderRule = mobileRules.find(
        (rule): rule is CSSStyleRule =>
          rule instanceof CSSStyleRule && rule.selectorText === '.gauge-slider',
      );
      const cardRule = mobileRules.find(
        (rule): rule is CSSStyleRule =>
          rule instanceof CSSStyleRule && rule.selectorText === '.gauge-widget',
      );
      expect(wrapper.find('.gauge-chart').exists()).toBe(true);
      expect(wrapper.find('.gauge-slider').exists()).toBe(true);
      expect(chartRule?.style.display).toBe('none');
      expect(mobileSliderRule?.style.display).toBe('flex');
      expect(cardRule?.style.getPropertyValue('aspect-ratio')).toBe('2 / 1');
      expect(cardRule?.style.getPropertyValue('width')).toBe('100%');
      expect(cardRule?.style.getPropertyValue('min-width')).toBe('0');
      expect(cardRule?.style.getPropertyValue('max-width')).toBe('none');
      expect(cardRule?.style.getPropertyValue('min-height')).toBe('0');
      expect(cardRule?.style.getPropertyValue('max-height')).toBe('none');
    } finally {
      style.remove();
      wrapper.unmount();
    }
  });

  it('shows and hides the tooltip on hover and keyboard focus', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('visualViewport', null);
    vi.stubGlobal('ResizeObserver', class {
      observe() {}
      unobserve() {}
      disconnect() {}
    });
    const wrapper = mount(GaugeWidget, {
      attachTo: document.body,
      props: { labelProp: 'Users', valueProp: 4 },
      global: { plugins: [vuetify] },
    });

    try {
      await wrapper.get('.gauge-widget').trigger('mouseenter');
      await vi.advanceTimersByTimeAsync(1999);
      expect(document.querySelector('.v-tooltip.v-overlay--active')).toBeNull();

      await vi.advanceTimersByTimeAsync(1);
      const tooltip = document.querySelector('.v-tooltip.v-overlay--active');
      expect(tooltip).not.toBeNull();
      expect(tooltip?.textContent).toContain('Site wide there are 4 Users');

      await wrapper.get('.gauge-widget').trigger('mouseleave');
      await vi.runAllTimersAsync();
      expect(document.querySelector('.v-tooltip.v-overlay--active')).toBeNull();

      const card = wrapper.get<HTMLElement>('.gauge-widget').element;
      card.focus();
      await vi.advanceTimersByTimeAsync(2000);
      expect(document.querySelector('.v-tooltip.v-overlay--active')?.textContent)
        .toContain('Site wide there are 4 Users');

      card.blur();
      await vi.runAllTimersAsync();
      expect(document.querySelector('.v-tooltip.v-overlay--active')).toBeNull();
    } finally {
      wrapper.unmount();
      vi.unstubAllGlobals();
      vi.useRealTimers();
    }
  });
});