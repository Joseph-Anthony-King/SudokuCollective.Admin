import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import TimeToCodeButton from '@/components/buttons/TimeToCodeButton.vue';
import { DialogType } from '@/enums/dialogType';
import { useDialogStore } from '@/stores/dialogStore';

const vuetify = createVuetify({
  components,
  directives,
});

describe('The TimeToCodeButton.vue component', () => {
  it('renders the coding prompt', () => {
    const wrapper = mount(TimeToCodeButton, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn }), vuetify],
      },
    });

    expect(wrapper.find('.time-to-code-button').exists()).toBe(true);
    expect(wrapper.find('.time-to-code-title').text()).toBe('Time to Get Coding!');
  });

  it('opens the OK dialog when clicked', async () => {
    const pinia = createTestingPinia({ createSpy: vi.fn });
    const dialogStore = useDialogStore(pinia);
    const wrapper = mount(TimeToCodeButton, {
      global: {
        plugins: [pinia, vuetify],
      },
    });

    await wrapper.find('.time-to-code-button').trigger('click');

    expect(dialogStore.updateDialog).toHaveBeenCalledOnce();
    expect(dialogStore.updateDialog).toHaveBeenCalledWith(
      'Time to Get Code!',
      'Don\'t be nervous! You can create your first app by clicking the "Create New App" button!',
      DialogType.OK,
    );
  });
});