import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import AvailableActions from '@/components/buttons/AvailableActions.vue';

describe('The AvailableActions.vue component', () => {
  // Create Vuetify instance for testing
  const vuetify = createVuetify({
    components,
    directives,
  });

  it('should render correctly with the title "Available Actions"', () => {
    const wrapper = mount(AvailableActions, {
      global: {
        plugins: [vuetify],
      },
    });

    // Check that the title renders correctly
    expect(wrapper.find('.v-card-title').exists()).toBe(true);
    expect(wrapper.find('.v-card-title').text()).toBe('Available Actions');
  });

  it('should render slot content properly', () => {
    const wrapper = mount(AvailableActions, {
      global: {
        plugins: [vuetify],
      },
      slots: {
        default: '<button class="test-button">Test Button</button>',
      },
    });

    // Check that slot content is rendered
    expect(wrapper.find('.test-button').exists()).toBe(true);
    expect(wrapper.find('.test-button').text()).toBe('Test Button');
  });
});
