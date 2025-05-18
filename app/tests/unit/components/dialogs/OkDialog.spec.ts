import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { nextTick } from 'vue';
import { createTestingPinia } from '@pinia/testing';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import OkDialog from '@/components/dialogs/OkDialog.vue';
import { useDialogStore } from '@/stores/dialogStore';
import { DialogType } from '@/enums/dialogType';

describe('The OkDialog.vue component', () => {
  const vuetify = createVuetify({
    components,
    directives,
  });

  const mockDialogTitle = 'Test Dialog Title';
  const mockDialogMessage = 'Test Dialog Message';
  
  let dialogStore: ReturnType<typeof useDialogStore>;

  beforeEach(() => {
    const testingPinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        dialogStore: {
          title: mockDialogTitle,
          message: mockDialogMessage,
          isActive: true,
          dialogType: DialogType.OK,
        },
      },
    });
    
    dialogStore = useDialogStore(testingPinia);
  });

  it('should render with correct title and message from store', async () => {
    const testingPinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        dialogStore: {
          title: mockDialogTitle,
          message: mockDialogMessage,
          isActive: true,
          dialogType: DialogType.OK,
        },
      },
    });
    
    const testDialogStore = useDialogStore(testingPinia);
    
    const wrapper = mount(OkDialog, {
      global: {
        plugins: [
          testingPinia,
          vuetify,
        ],
      },
    });

    await nextTick();
    
    expect(wrapper.find('.headline').html()).toContain(mockDialogTitle);
    expect(wrapper.find('p').html()).toContain(mockDialogMessage);
    
    expect(wrapper.find('button').text().toLowerCase()).toContain('ok');
  });

  it('should call initializeStore when OK button is clicked', async () => {
    const testingPinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        dialogStore: {
          title: mockDialogTitle,
          message: mockDialogMessage,
          isActive: true,
          dialogType: DialogType.OK,
        },
      },
    });
    
    const testDialogStore = useDialogStore(testingPinia);
    
    const wrapper = mount(OkDialog, {
      global: {
        plugins: [
          testingPinia,
          vuetify,
        ],
      },
    });

    await wrapper.find('button').trigger('click');
    await flushPromises();
    
    expect(testDialogStore.initializeStore).toHaveBeenCalled();
  });

  it('should handle HTML content in title and message', async () => {
    const htmlTitle = '<em>HTML Title</em>';
    const htmlMessage = '<strong>HTML Message</strong>';
    
    const testingPinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        dialogStore: {
          title: htmlTitle,
          message: htmlMessage,
          isActive: true,
          dialogType: DialogType.OK,
        },
      },
    });
    
    const wrapper = mount(OkDialog, {
      global: {
        plugins: [
          testingPinia,
          vuetify,
        ],
      },
    });
    
    await nextTick();

    expect(wrapper.find('.headline').html()).toContain(htmlTitle);
    expect(wrapper.find('p').html()).toContain(htmlMessage);
  });

  it('should verify the structure and CSS classes of the dialog', async () => {
    const testingPinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        dialogStore: {
          title: mockDialogTitle,
          message: mockDialogMessage,
          isActive: true,
          dialogType: DialogType.OK,
        },
      },
    });
    
    const wrapper = mount(OkDialog, {
      global: {
        plugins: [
          testingPinia,
          vuetify,
        ],
      },
    });
    
    await nextTick();

    expect(wrapper.find('.v-card').exists()).toBe(true);
    expect(wrapper.find('.v-card-title').exists()).toBe(true);
    expect(wrapper.find('.v-card-text').exists()).toBe(true);
    expect(wrapper.find('.v-card-actions').exists()).toBe(true);
    
    expect(wrapper.find('.v-card').classes()).toContain('justify-center');
    expect(wrapper.find('.v-card').classes()).toContain('text-center');
    expect(wrapper.find('.v-card-actions').classes()).toContain('text-center');
    
    const button = wrapper.find('.v-btn');
    expect(button.exists()).toBe(true);
    
    const buttonHTML = button.html();
    expect(buttonHTML).toContain('blue darken-1'); // Check if color is in the HTML
    
    expect(button.classes()).toContain('v-btn--variant-text');
    
    expect(button.text().toLowerCase()).toBe('ok');
  });

  it('should handle event.preventDefault when OK button is clicked', async () => {
    const testingPinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        dialogStore: {
          title: mockDialogTitle,
          message: mockDialogMessage,
          isActive: true,
          dialogType: DialogType.OK,
        },
      },
    });
    
    const testDialogStore = useDialogStore(testingPinia);
    
    const wrapper = mount(OkDialog, {
      global: {
        plugins: [
          testingPinia,
          vuetify,
        ],
      },
    });

    const mockEvent = {
      preventDefault: vi.fn()
    };

    const vm = wrapper.vm;

    (vm as any).closeHandler(mockEvent);
    
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    
    expect(testDialogStore.initializeStore).toHaveBeenCalled();
  });

  it('should work when event is undefined', async () => {
    const testingPinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        dialogStore: {
          title: mockDialogTitle,
          message: mockDialogMessage,
          isActive: true,
          dialogType: DialogType.OK,
        },
      },
    });
    
    const testDialogStore = useDialogStore(testingPinia);
    
    const wrapper = mount(OkDialog, {
      global: {
        plugins: [
          testingPinia,
          vuetify,
        ],
      },
    });

    const vm = wrapper.vm;

    (vm as any).closeHandler();
    
    expect(testDialogStore.initializeStore).toHaveBeenCalled();
  });

  it('should handle column layout for the OK button', async () => {
    const testingPinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        dialogStore: {
          title: mockDialogTitle,
          message: mockDialogMessage,
          isActive: true,
          dialogType: DialogType.OK,
        },
      },
    });
    
    const wrapper = mount(OkDialog, {
      global: {
        plugins: [
          testingPinia,
          vuetify,
        ],
      },
    });
    
    await nextTick();

    const buttonColumn = wrapper.find('.v-card-actions .v-col');
    expect(buttonColumn.exists()).toBe(true);
  });
});
