import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import AppButton from '@/components/buttons/AppButton.vue';
import { App } from '@/models/domain/app';
import { ReleaseEnvironment } from '@/enums/releaseEnvironment';

describe('The AppButton.vue component', () => {
  // Create Vuetify instance for testing
  const vuetify = createVuetify({
    components,
    directives,
  });

  it('should render correctly with app props', () => {
    const app = {
      id: 1,
      name: 'Test App',
      environment: ReleaseEnvironment.LOCAL,
      isActive: true,
    } as App;

    const wrapper = mount(AppButton, {
      props: {
        app,
        index: 0,
      },
      global: {
        plugins: [vuetify],
      },
    });

    // Check that component structure is rendered correctly
    expect(wrapper.find('.app-button').exists()).toBe(true);
    expect(wrapper.find('.select-app-title').exists()).toBe(true);
    expect(wrapper.find('.select-app-text').exists()).toBe(true);
    
    // Check content is displayed correctly
    expect(wrapper.find('.select-app-title').text()).toBe('Test App');
    expect(wrapper.find('.select-app-text').text()).toBe('In Development');
  });

  it('should emit app-selected event when clicked', async () => {
    const app = {
      id: 1,
      name: 'Test App',
    } as App;

    const wrapper = mount(AppButton, {
      props: {
        app,
        index: 0,
      },
      global: {
        plugins: [vuetify],
      },
    });

    await wrapper.find('.app-button').trigger('click');
    
    expect(wrapper.emitted()).toHaveProperty('app-selected');
    expect(wrapper.emitted()['app-selected'][0]).toEqual([1, null]);
  });

  it('should format long app names correctly', () => {
    const app = {
      id: 1,
      name: 'This is a very long app name that needs formatting',
      environment: ReleaseEnvironment.LOCAL,
      isActive: true,
    } as App;

    const wrapper = mount(AppButton, {
      props: {
        app,
        index: 0,
      },
      global: {
        plugins: [vuetify],
      },
    });

    const formattedTitle = wrapper.find('.select-app-title').text();
    expect(formattedTitle).toContain('This');
    expect(formattedTitle).toContain('is');
    expect(formattedTitle).toContain('a');
    expect(formattedTitle).toContain('very');
    expect(formattedTitle).not.toContain('long');  // Should be truncated
  });

  it('should handle null app name', () => {
    const app = {
      id: 1,
      name: null,
      environment: ReleaseEnvironment.LOCAL,
      isActive: true,
    } as unknown as App;

    const wrapper = mount(AppButton, {
      props: {
        app,
        index: 0,
      },
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.find('.select-app-title').text()).toBe('');
  });

  it('should display correct status for different environments', () => {
    const testCases = [
      { environment: ReleaseEnvironment.LOCAL, isActive: true, expected: 'In Development' },
      { environment: ReleaseEnvironment.TEST, isActive: true, expected: 'In Test' },
      { environment: ReleaseEnvironment.STAGING, isActive: true, expected: 'In Staging' },
      { environment: ReleaseEnvironment.PROD, isActive: true, expected: 'In Production' },
      { environment: ReleaseEnvironment.LOCAL, isActive: false, expected: 'Deactivated' },
      { environment: ReleaseEnvironment.TEST, isActive: false, expected: 'Deactivated' },
      { environment: ReleaseEnvironment.STAGING, isActive: false, expected: 'Deactivated' },
      { environment: ReleaseEnvironment.PROD, isActive: false, expected: 'Deactivated' },
      // Test invalid environment case
      { environment: 999, isActive: true, expected: 'Invalid Status' } as any,
    ];

    testCases.forEach(testCase => {
      const app = {
        id: 1,
        name: 'Test App',
        environment: testCase.environment,
        isActive: testCase.isActive,
      } as App;

      const wrapper = mount(AppButton, {
        props: {
          app,
          index: 0,
        },
        global: {
          plugins: [vuetify],
        },
      });

      expect(wrapper.find('.select-app-text').text()).toBe(testCase.expected);
    });
  });

  it('should apply secondary color when index is even', () => {
    const app = { 
      id: 1, 
      name: 'Test App',
      isActive: true
    } as App;
    
    const wrapper = mount(AppButton, {
      props: {
        app,
        index: 0, // Even index
      },
      global: {
        plugins: [vuetify],
      },
    });
    
    // Instead of using findComponent, directly check that our binding works as expected
    // by examining v-card's rendered color class
    expect(wrapper.find('.v-card').classes()).toContain('bg-secondary');
  });

  it('should apply error color when index is odd', () => {
    const app = { 
      id: 1, 
      name: 'Test App',
      isActive: true 
    } as App;
    
    const wrapper = mount(AppButton, {
      props: {
        app,
        index: 1, // Odd index
      },
      global: {
        plugins: [vuetify],
      },
    });
    
    // Instead of using props, check for the Vuetify color class directly
    expect(wrapper.find('.v-card').classes()).toContain('bg-error');
  });
});
