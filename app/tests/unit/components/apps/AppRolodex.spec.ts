import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { nextTick } from 'vue';
import { createTestingPinia } from '@pinia/testing';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import AppRolodex from '@/components/apps/AppRolodex.vue';
import AppButton from '@/components/buttons/AppButton.vue';
import { useAppStore } from '@/stores/appStore';
import { App } from '@/models/domain/app';

vi.mock('@/utilities/common', () => ({
  default: () => ({
    updateAppProcessingAsync: (callback: () => void) => {
      callback();
    },
  }),
}));

describe('The AppRolodex.vue component', () => {
  const testApps: App[] = [
    { id: 1, name: 'Test App 1', license: 'License1' } as App,
    { id: 2, name: 'Test App 2', license: 'License2' } as App,
  ];

  const testRegisteredApps: App[] = [
    { id: 3, name: 'Registered App 1', license: 'License3' } as App,
  ];

  const vuetify = createVuetify({
    components,
    directives,
  });

  let appStore: ReturnType<typeof useAppStore>;

  beforeEach(() => {
    appStore = useAppStore(createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        appStore: {
          selectedApp: null,
          myApps: testApps,
          myRegisteredApps: testRegisteredApps,
        },
      },
    }));
  });

  it('should render the component correctly', () => {
    const wrapper = mount(AppRolodex, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              appStore: {
                selectedApp: null,
                myApps: testApps,
                myRegisteredApps: testRegisteredApps,
              },
            },
          }),
          vuetify,
        ],
      },
    });

    expect(wrapper.find('.v-card-title').exists()).toBe(true);
    expect(wrapper.find('.v-select').exists()).toBe(true);
  });


  it('shows "Your Apps" by default and displays correct apps and CreateAppButton', async () => {
    const wrapper = mount(AppRolodex, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              appStore: {
                selectedApp: null,
                myApps: testApps,
                myRegisteredApps: testRegisteredApps,
              },
            },
          }),
          vuetify,
        ],
      },
    });
    expect(wrapper.vm.selectedApps).toBe('Your Apps');
    // Should show all apps from getMyApps
    expect(wrapper.findAllComponents(AppButton).length).toBe(2);
    // Should show CreateAppButton
    expect(wrapper.findComponent({ name: 'CreateAppButton' }).exists()).toBe(true);
  });

  it('switches to "Your Registered Apps" and displays correct apps, hides CreateAppButton', async () => {
    const wrapper = mount(AppRolodex, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              appStore: {
                selectedApp: null,
                myApps: testApps,
                myRegisteredApps: testRegisteredApps,
              },
            },
          }),
          vuetify,
        ],
      },
    });
    wrapper.vm.selectedApps = 'Your Registered Apps';
    await nextTick();
    await flushPromises();
    // Should show only registered apps
    expect(wrapper.findAllComponents(AppButton).length).toBe(1);
    // Should not show CreateAppButton
    expect(wrapper.findComponent({ name: 'CreateAppButton' }).exists()).toBe(false);
  });

  it('shows "Time to Get Coding!" when there are no apps for selected type', async () => {
    const wrapper = mount(AppRolodex, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              appStore: {
                selectedApp: null,
                myApps: [],
                myRegisteredApps: [],
              },
            },
          }),
          vuetify,
        ],
      },
    });
    // For "Your Apps"
    expect(wrapper.find('.no-apps-message').exists()).toBe(true);
    expect(wrapper.find('.no-apps-message').text()).toBe('Time to Get Coding!');
    // For "Your Registered Apps"
    wrapper.vm.selectedApps = 'Your Registered Apps';
    await nextTick();
    await flushPromises();
    expect(wrapper.find('.no-apps-message').exists()).toBe(true);
  });
  it('emits show-create-app when CreateAppButton is clicked', async () => {
    const wrapper = mount(AppRolodex, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              appStore: {
                selectedApp: null,
                myApps: testApps,
                myRegisteredApps: testRegisteredApps,
              },
            },
          }),
          vuetify,
        ],
      },
    });
    const createBtn = wrapper.findComponent({ name: 'CreateAppButton' });
    await createBtn.trigger('click');
    expect(wrapper.emitted('show-create-app')).toBeTruthy();
  });

  it('calls appSelected with correct id when AppButton emits app-selected event', async () => {
    const mockSetSelectedApp = vi.fn();
    
    const testingPinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false,
      initialState: {
        appStore: {
          selectedApp: null,
          myApps: testApps,
          myRegisteredApps: testRegisteredApps,
        },
      },
    });
    
    const testAppStore = useAppStore(testingPinia);
    
    vi.spyOn(testAppStore, 'setSelectedAppAsync').mockImplementation(mockSetSelectedApp);
    
    const wrapper = mount(AppRolodex, {
      global: {
        plugins: [
          testingPinia,
          vuetify,
        ],
      },
    });
    
    const appButtons = wrapper.findAllComponents(AppButton);
    appButtons[0].vm.$emit('app-selected', 1);
    await flushPromises();

    expect(mockSetSelectedApp).toHaveBeenCalledWith(1);
  });

  it('deselects app when the same app is selected twice', async () => {
    const mockSetSelectedApp = vi.fn();
    
    const testingPinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false,
      initialState: {
        appStore: {
          selectedApp: { id: 1 } as App,
          myApps: testApps,
          myRegisteredApps: testRegisteredApps,
        },
      },
    });
    
    const testAppStore = useAppStore(testingPinia);
    
    vi.spyOn(testAppStore, 'setSelectedAppAsync').mockImplementation(mockSetSelectedApp);
    
    const wrapper = mount(AppRolodex, {
      global: {
        plugins: [
          testingPinia,
          vuetify,
        ],
      },
    });

    const appButtons = wrapper.findAllComponents(AppButton);
    appButtons[0].vm.$emit('app-selected', 1);
    await flushPromises();

    expect(mockSetSelectedApp).toHaveBeenCalled();
    expect(mockSetSelectedApp.mock.calls[0].length).toBe(0);
  });
});
