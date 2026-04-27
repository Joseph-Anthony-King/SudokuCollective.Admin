  import { describe, it, expect } from 'vitest';
  import { mount } from '@vue/test-utils';
  import { createVuetify } from 'vuetify';
  import * as components from 'vuetify/components';
  import * as directives from 'vuetify/directives';
  import AppButton from '@/components/buttons/AppButton.vue';
  import { App } from '@/models/domain/app';
  import { ReleaseEnvironment } from '@/enums/releaseEnvironment';

  const vuetify = createVuetify({
    components,
    directives,
  });

  describe('The AppButton.vue component', () => {
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

      expect(wrapper.find('.select-app-title').exists()).toBe(true);
      expect(wrapper.find('.select-app-text').exists()).toBe(true);
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

    it('should format long app names with newlines and truncate after 4 words', () => {
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
      expect(formattedTitle).not.toContain('long');
    });

    it('should not format short app names', () => {
      const app = {
        id: 1,
        name: 'Short',
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

      expect(wrapper.find('.select-app-title').text()).toBe('Short');
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

    it('should display In Development status for LOCAL and active', () => {
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

      expect(wrapper.find('.select-app-text').text()).toBe('In Development');
    });

    it('should display In Test status for TEST and active', () => {
      const app = {
        id: 1,
        name: 'Test App',
        environment: ReleaseEnvironment.TEST,
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

      expect(wrapper.find('.select-app-text').text()).toBe('In Test');
    });

    it('should display In Staging status for STAGING and active', () => {
      const app = {
        id: 1,
        name: 'Test App',
        environment: ReleaseEnvironment.STAGING,
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

      expect(wrapper.find('.select-app-text').text()).toBe('In Staging');
    });

    it('should display In Production status for PROD and active', () => {
      const app = {
        id: 1,
        name: 'Test App',
        environment: ReleaseEnvironment.PROD,
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

      expect(wrapper.find('.select-app-text').text()).toBe('In Production');
    });

    it('should display Deactivated status when isActive is false', () => {
      const app = {
        id: 1,
        name: 'Test App',
        environment: ReleaseEnvironment.LOCAL,
        isActive: false,
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

      expect(wrapper.find('.select-app-text').text()).toBe('Deactivated');
    });

    it('should display Invalid Status for unknown environment', () => {
      const app = {
        id: 1,
        name: 'Test App',
        environment: 999,
        isActive: true,
      } as any;

      const wrapper = mount(AppButton, {
        props: {
          app,
          index: 0,
        },
        global: {
          plugins: [vuetify],
        },
      });

      expect(wrapper.find('.select-app-text').text()).toBe('Invalid Status');
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
          index: 0,
        },
        global: {
          plugins: [vuetify],
        },
      });

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
          index: 1,
        },
        global: {
          plugins: [vuetify],
        },
      });

      expect(wrapper.find('.v-card').classes()).toContain('bg-error');
    });

    it('should handle missing index prop gracefully (defaults to 0)', () => {
      const app = { id: 1, name: 'Test App', isActive: true } as App;
      const wrapper = mount(AppButton, {
        props: { app },
        global: { plugins: [vuetify] },
      });
      expect(wrapper.find('.v-card').classes()).toContain('bg-secondary');
    });

    it('should emit app-selected with correct id on click', async () => {
      const app = { id: 42, name: 'Emit Test', isActive: true } as App;
      const wrapper = mount(AppButton, {
        props: { app, index: 0 },
        global: { plugins: [vuetify] },
      });
      await wrapper.find('.app-button').trigger('click');
      expect(wrapper.emitted('app-selected')).toBeTruthy();
      expect(wrapper.emitted('app-selected')![0]).toEqual([42, null]);
    });

    it('should format app name with exactly 4 words when name has more than 4 words', () => {
      const app = {
        id: 1,
        name: 'one two three four five six seven',
        environment: ReleaseEnvironment.LOCAL,
        isActive: true,
      } as App;
      const wrapper = mount(AppButton, {
        props: { app, index: 0 },
        global: { plugins: [vuetify] },
      });
      const formatted = wrapper.find('.select-app-title').text();
      const lines = formatted.split('\n');
      expect(lines.length).toBe(4);
      expect(lines[0]).toBe('one');
      expect(lines[1]).toBe('two');
      expect(lines[2]).toBe('three');
      expect(lines[3]).toBe('four');
      expect(formatted).not.toContain('five');
    });

    it('should handle app name with exactly 16 characters without formatting', () => {
      const app = {
        id: 1,
        name: 'ExactlySixteenCh',
        environment: ReleaseEnvironment.LOCAL,
        isActive: true,
      } as App;
      const wrapper = mount(AppButton, {
        props: { app, index: 0 },
        global: { plugins: [vuetify] },
      });
      expect(wrapper.find('.select-app-title').text()).toBe('ExactlySixteenCh');
    });

    it('should handle app name with more than 15 characters but less than 4 words', () => {
      const app = {
        id: 1,
        name: 'LongSingleWordName',
        environment: ReleaseEnvironment.LOCAL,
        isActive: true,
      } as App;
      const wrapper = mount(AppButton, {
        props: { app, index: 0 },
        global: { plugins: [vuetify] },
      });
      expect(wrapper.find('.select-app-title').text()).toBe('LongSingleWordName');
    });
  });
