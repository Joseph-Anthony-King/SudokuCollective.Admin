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
        stubs: {
          AppButton: true,
        },
      },
    });

    expect(wrapper.find('.v-card-title').exists()).toBe(true);
    expect(wrapper.find('.v-select').exists()).toBe(true);
  });

  it('should show "Your Apps" by default and displays correct apps', async () => {
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
        stubs: {
          AppButton: true,
        },
      },
    });

    expect(wrapper.vm.selectedApps).toBe('Your Apps');
    expect(wrapper.vm.apps.length).toBe(2);
    expect(wrapper.findAllComponents(AppButton).length).toBe(2);
  });

  it('should change apps when switching to "Your Registered Apps"', async () => {
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
        stubs: {
          AppButton: true,
        },
      },
    });

    wrapper.vm.selectedApps = 'Your Registered Apps';
    await nextTick();
    
    expect(wrapper.vm.apps.length).toBe(1);
    expect(wrapper.findAllComponents(AppButton).length).toBe(1);
  });

  it('should show "Time to Get Coding!" when there are no apps', async () => {
    const wrapper = mount(AppRolodex, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              appStore: {
                selectedApp: null,
                myApps: [],
                myRegisteredApps: testRegisteredApps,
              },
            },
          }),
          vuetify,
        ],
        stubs: {
          AppButton: true,
        },
      },
    });

    expect(wrapper.find('.no-apps-message').exists()).toBe(true);
    expect(wrapper.find('.no-apps-message').text()).toBe('Time to Get Coding!');
    
    wrapper.vm.selectedApps = 'Your Registered Apps';
    await nextTick();
    
    expect(wrapper.find('.no-apps-message').exists()).toBe(false);
  });

  it('should call appSelected method with correct id when AppButton emits app-selected event', async () => {
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
    
    vi.spyOn(testAppStore, 'setSelectedApp').mockImplementation(mockSetSelectedApp);
    
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

  it('should deselect app when the same app is selected twice', async () => {
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
    
    vi.spyOn(testAppStore, 'setSelectedApp').mockImplementation(mockSetSelectedApp);
    
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
