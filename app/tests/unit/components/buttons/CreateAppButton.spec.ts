import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import CreateAppButton from '@/components/buttons/CreateAppButton.vue';

const vuetify = createVuetify({
  components,
  directives,
});

describe('The CreateAppButton.vue component', () => {
  it('should render correctly', () => {
    const wrapper = mount(CreateAppButton, {
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.find('.v-card').exists()).toBe(true);
    expect(wrapper.find('.app-button').exists()).toBe(true);
    expect(wrapper.find('.create-app-button').exists()).toBe(true);
  });

  it('should display "Create New App" text', () => {
    const wrapper = mount(CreateAppButton, {
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.find('.select-app-title').text()).toBe('Create New App');
  });

  it('should have correct CSS classes applied', () => {
    const wrapper = mount(CreateAppButton, {
      global: {
        plugins: [vuetify],
      },
    });

    const card = wrapper.find('.v-card');
    expect(card.classes()).toContain('app-button');
    expect(card.classes()).toContain('create-app-button');
  });

  it('should emit create-app-clicked event when clicked', async () => {
    const wrapper = mount(CreateAppButton, {
      global: {
        plugins: [vuetify],
      },
    });

    await wrapper.find('.create-app-button').trigger('click');

    expect(wrapper.emitted()).toHaveProperty('create-app-clicked');
    expect(wrapper.emitted('create-app-clicked')).toBeTruthy();
    expect(wrapper.emitted('create-app-clicked')!.length).toBe(1);
  });

  it('should emit create-app-clicked event when v-card is clicked', async () => {
    const wrapper = mount(CreateAppButton, {
      global: {
        plugins: [vuetify],
      },
    });

    await wrapper.find('.v-card').trigger('click');

    expect(wrapper.emitted('create-app-clicked')).toBeTruthy();
    expect(wrapper.emitted('create-app-clicked')!.length).toBe(1);
  });

  it('should emit create-app-clicked event multiple times on multiple clicks', async () => {
    const wrapper = mount(CreateAppButton, {
      global: {
        plugins: [vuetify],
      },
    });

    await wrapper.find('.create-app-button').trigger('click');
    await wrapper.find('.create-app-button').trigger('click');
    await wrapper.find('.create-app-button').trigger('click');

    expect(wrapper.emitted('create-app-clicked')).toBeTruthy();
    expect(wrapper.emitted('create-app-clicked')!.length).toBe(3);
  });

  it('should have v-card-title element', () => {
    const wrapper = mount(CreateAppButton, {
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.find('.v-card-title').exists()).toBe(true);
  });

  it('should have select-app-title span inside v-card-title', () => {
    const wrapper = mount(CreateAppButton, {
      global: {
        plugins: [vuetify],
      },
    });

    const title = wrapper.find('.v-card-title');
    expect(title.find('.select-app-title').exists()).toBe(true);
  });
});
