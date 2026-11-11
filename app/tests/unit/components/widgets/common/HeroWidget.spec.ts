import { mount } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import { VImg } from 'vuetify/components';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { describe, expect, it } from 'vitest';
import HeroWidget from '@/components/widgets/common/HeroWidget.vue';

const vuetify = createVuetify({
  components,
  directives,
});

describe('HeroWidget.vue', () => {
  const mountWidget = (options: {
    headline?: string;
    slots?: Record<string, string>;
  } = {}) =>
    mount(HeroWidget, {
      props: options.headline === undefined ? {} : { headline: options.headline },
      slots: options.slots,
      global: {
        plugins: [vuetify],
      },
    });

  it('renders an empty headline by default and includes the logo', () => {
    const wrapper = mountWidget();
    const headline = wrapper.get('h1');
    const logo = wrapper.getComponent(VImg);

    expect(headline.text()).toBe('');
    expect(headline.classes()).toContain('centered-welcome-message');
    expect(logo.props('src')).toBe('/images/logo.png');
    expect(logo.props('height')).toBe('200');
    expect(logo.classes()).toContain('centered-logo');
  });

  it('renders the provided headline and default slot content', () => {
    const wrapper = mountWidget({
      headline: 'Welcome, admins!',
      slots: {
        default: '<section data-testid="hero-content">Dashboard content</section>',
      },
    });

    expect(wrapper.get('h1').text()).toBe('Welcome, admins!');
    expect(wrapper.get('[data-testid="hero-content"]').text()).toBe('Dashboard content');
    expect(wrapper.get('.app-responsive-viewport').classes()).toContain('app-responsive-viewport');
    expect(wrapper.get('.v-card').classes()).toContain('v-card');
  });
});