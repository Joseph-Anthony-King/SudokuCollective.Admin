import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import FooterNav from '@/components/navigation/FooterNav.vue';

describe('FooterNav.vue', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

  it('renders the current copyright year and author profile link', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 1, 12));

    const wrapper = mount(FooterNav, {
      global: {
        stubs: {
          VFooter: { template: '<footer><slot /></footer>' },
          VCard: { template: '<section><slot /></section>' },
          VDivider: { template: '<hr />' },
          VCardText: { template: '<div><slot /></div>' },
        },
      },
    });

    expect(wrapper.text()).toContain('© Copyright 2026:');
    const authorLink = wrapper.get('a');
    expect(authorLink.text()).toBe('Joseph-Anthony-King');
    expect(authorLink.attributes('href')).toBe('https://www.linkedin.com/in/joseph-king-23650256/');
    expect(authorLink.attributes('target')).toBe('_blank');
    expect(authorLink.attributes('title')).toBe('LinkedIn Profile: Joseph Anthony King');
  });

  it('renders the configured application version', () => {
    vi.stubEnv('VITE_APP_VERSION', 'test-version');

    const wrapper = mount(FooterNav, {
      global: {
        stubs: {
          VFooter: { template: '<footer><slot /></footer>' },
          VCard: { template: '<section><slot /></section>' },
          VDivider: { template: '<hr />' },
          VCardText: { template: '<div><slot /></div>' },
        },
      },
    });

    expect(wrapper.get('.version').text()).toBe('version test-version');
  });
});