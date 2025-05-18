import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { nextTick } from 'vue';
import { createTestingPinia } from '@pinia/testing';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import { useDialogStore } from '@/stores/dialogStore';
import { DialogType } from '@/enums/dialogType';

describe('The ConfirmDialog.vue component', () => {
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
          dialogIsActive: true,
        },
      },
    });
    
    const testDialogStore = useDialogStore(testingPinia);
    
    const wrapper = mount(ConfirmDialog, {
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
    
    expect(wrapper.findAll('button')[0].text()).toContain('Yes');
    expect(wrapper.findAll('button')[1].text()).toContain('No');
  });

  it('should call correct methods when Yes button is clicked', async () => {
    const testingPinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        dialogStore: {
          title: mockDialogTitle,
          message: mockDialogMessage,
          isActive: true,
        },
      },
    });
    
    const testDialogStore = useDialogStore(testingPinia);
    
    const wrapper = mount(ConfirmDialog, {
      global: {
        plugins: [
          testingPinia,
          vuetify,
        ],
      },
    });

    await wrapper.findAll('button')[0].trigger('click');
    await flushPromises();
    
    expect(testDialogStore.updateDialogIsActive).toHaveBeenCalledWith(false);
    expect(testDialogStore.performConfirmedAction).toHaveBeenCalled();
    expect(testDialogStore.initializeStore).toHaveBeenCalled();
  });

  it('should call correct methods when No button is clicked', async () => {
    const testingPinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        dialogStore: {
          title: mockDialogTitle,
          message: mockDialogMessage,
          isActive: true,
        },
      },
    });
    
    const testDialogStore = useDialogStore(testingPinia);
    
    const wrapper = mount(ConfirmDialog, {
      global: {
        plugins: [
          testingPinia,
          vuetify,
        ],
      },
    });

    await wrapper.findAll('button')[1].trigger('click');
    await flushPromises();
    
    expect(testDialogStore.updateDialogIsActive).toHaveBeenCalledWith(false);
    expect(testDialogStore.performNotConfirmedAction).toHaveBeenCalled();
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
        },
      },
    });
    
    const wrapper = mount(ConfirmDialog, {
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
        },
      },
    });
    
    const wrapper = mount(ConfirmDialog, {
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
    
    const buttons = wrapper.findAll('.v-btn');
    expect(buttons.length).toBe(2);

    expect(buttons[0].text()).toBe('Yes');
    expect(buttons[1].text()).toBe('No');
  });

  it('should handle real async function in confirmed action', async () => {
    const asyncActionMock = vi.fn();
    
    const testingPinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false,
      initialState: {
        dialogStore: {
          title: mockDialogTitle,
          message: mockDialogMessage,
          isActive: true,
          confirmedActionDelegate: asyncActionMock,
        },
      },
    });
    
    const testDialogStore = useDialogStore(testingPinia);
    
    const wrapper = mount(ConfirmDialog, {
      global: {
        plugins: [
          testingPinia,
          vuetify,
        ],
      },
    });

    await wrapper.findAll('button')[0].trigger('click');
    await flushPromises();
    
    expect(asyncActionMock).toHaveBeenCalled();
    expect(testDialogStore.updateDialogIsActive).toHaveBeenCalledWith(false);
    expect(testDialogStore.initializeStore).toHaveBeenCalled();
  });

  it('should handle different dialog types correctly', async () => {
    const testingPinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        dialogStore: {
          title: mockDialogTitle,
          message: mockDialogMessage,
          isActive: true,
          dialogType: DialogType.CONFIRM,
        },
      },
    });
    
    const wrapper = mount(ConfirmDialog, {
      global: {
        plugins: [
          testingPinia,
          vuetify,
        ],
      },
    });
    
    await nextTick();

    expect(wrapper.findAll('button').length).toBe(2);
    
    wrapper.unmount();
    
    const okDialogPinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        dialogStore: {
          title: 'OK Dialog',
          message: 'This is an OK dialog',
          isActive: true,
          dialogType: DialogType.OK,
        },
      },
    });
    
    const okWrapper = mount(ConfirmDialog, {
      global: {
        plugins: [
          okDialogPinia,
          vuetify,
        ],
      },
    });
    
    await nextTick();
    
    expect(okWrapper.findAll('button').length).toBe(2);
  });
});
