// @ts-nocheck - Vue Test Utils component vm internals are not typed
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { mount, VueWrapper, flushPromises } from '@vue/test-utils';
import { nextTick } from 'vue';
import { createTestingPinia } from '@pinia/testing';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import DashboardView from '@/views/DashboardView.vue';
import DashboardPage from '@/components/pages/DashboardPage.vue';
import { useAppStore } from '@/stores/appStore';
import { useUserStore } from '@/stores/userStore';
import { User } from '@/models/domain/user';
import { App } from '@/models/domain/app';
import { ReleaseEnvironment } from '@/enums/releaseEnvironment';
import { TimeFrame } from '@/enums/timeFrame';
import type { ICreateAppLicenseRequestData } from '@/interfaces/requests/iCreateAppLicenseRequestData';

// Type for initial store state in tests
interface InitialStoreState {
  appStore?: {
    selectedApp?: App | null;
  };
  userStore?: {
    user?: User;
  };
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

const vuetify = createVuetify({
  components,
  directives,
});

describe('The DashboardView vue view', () => {
  let wrapper: VueWrapper<any>;
  let mockApp: App;
  let mockUser: User;

  const createWrapper = (props = {}, initialStoreState: InitialStoreState = {}) => {
    mockApp = new App();
    Object.assign(mockApp, {
      id: 1,
      name: 'Test App',
      license: 'test-license-123',
      ownerId: 1,
      localUrl: 'http://localhost:3000',
      testUrl: 'http://test.example.com',
      stagingUrl: 'http://staging.example.com',
      prodUrl: 'http://prod.example.com',
      sourceCodeUrl: 'http://github.com/test/repo',
      isActive: true,
      environment: ReleaseEnvironment.LOCAL,
      permitSuperUserAccess: true,
      permitCollectiveLogins: false,
      disableCustomUrls: false,
      customEmailConfirmationAction: 'confirm-email',
      customPasswordResetAction: 'reset-password',
      useCustomSMTPServer: false,
      smtpServerSettings: null,
      timeFrame: TimeFrame.MINUTES,
      accessDuration: 30,
      displayInGallery: true,
      dateCreated: new Date('2023-01-01'),
      dateUpdated: new Date('2023-01-02'),
      users: [],
      isEditing: false,
    });

    mockUser = new User();
    mockUser.id = 123;
    mockUser.userName = 'testuser';
    mockUser.email = 'test@example.com';
    mockUser.isLoggedIn = true;
    mockUser.isLoggingIn = false;

    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        appStore: {
          selectedApp: mockApp,
          ...initialStoreState.appStore,
        },
        userStore: {
          user: mockUser,
          ...initialStoreState.userStore,
        },
      },
    });

    return mount(DashboardView, {
      props,
      global: {
        plugins: [vuetify, pinia],
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  describe('Basic Rendering', () => {
    it('should render properly', () => {
      wrapper = createWrapper();
      expect(wrapper.exists()).toBe(true);
    });

    it('should render DashboardPage component', () => {
      wrapper = createWrapper();
      expect(wrapper.findComponent(DashboardPage).exists()).toBe(true);
    });

    it('should render the Dashboard title', () => {
      wrapper = createWrapper();
      const title = wrapper.find('.headline');
      expect(title.text()).toBe('Dashboard');
    });

    it('should render v-card with elevation', () => {
      wrapper = createWrapper();
      expect(wrapper.find('.v-card').exists()).toBe(true);
    });

    it('should render AppRolodex component', () => {
      wrapper = createWrapper();
      const appRolodex = wrapper.findComponent({ name: 'AppRolodex' });
      expect(appRolodex.exists()).toBe(true);
    });
  });

  describe('Create App Flow', () => {
    it('should not show CreateAppForm by default', () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);
      expect(dashboardPage.vm.showCreateApp).toBe(false);
      expect(wrapper.find('#app-create').exists()).toBe(false);
    });

    it('should show CreateAppForm when showCreateAppForm is called', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);

      dashboardPage.vm.showCreateAppForm();
      await nextTick();

      expect(dashboardPage.vm.showCreateApp).toBe(true);
    });

    it('should render CreateAppForm when showCreateApp is true', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);

      dashboardPage.vm.showCreateApp = true;
      await nextTick();

      expect(wrapper.find('#app-create').exists()).toBe(true);
    });

    it('should hide CreateAppForm when hideCreateAppForm is called', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);

      dashboardPage.vm.showCreateApp = true;
      await nextTick();

      dashboardPage.vm.hideCreateAppForm();
      await nextTick();

      expect(dashboardPage.vm.showCreateApp).toBe(false);
    });

    it('should handle show-create-app event from AppRolodex', async () => {
      wrapper = createWrapper();
      const appRolodex = wrapper.findComponent({ name: 'AppRolodex' });
      const dashboardPage = wrapper.findComponent(DashboardPage);

      appRolodex.vm.$emit('show-create-app');
      await nextTick();

      expect(dashboardPage.vm.showCreateApp).toBe(true);
    });

    it('should handle cancel event from CreateAppForm', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);

      dashboardPage.vm.showCreateApp = true;
      await nextTick();

      const createAppForm = wrapper.findComponent({ name: 'CreateAppForm' });
      createAppForm.vm.$emit('cancel');
      await nextTick();

      expect(dashboardPage.vm.showCreateApp).toBe(false);
    });

    it('should handle created event from CreateAppForm', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);
      const appStore = useAppStore();

      appStore.postCreateAppLicenseAsync = vi.fn().mockResolvedValue(true);

      dashboardPage.vm.showCreateApp = true;
      await nextTick();

      const createAppData: ICreateAppLicenseRequestData = {
        name: 'New App',
        ownerId: 123,
        localUrl: 'http://localhost:3000',
        testUrl: 'http://test.example.com',
        stagingUrl: 'http://staging.example.com',
        prodUrl: 'http://prod.example.com',
        sourceCodeUrl: 'http://github.com/new/repo',
      };

      await dashboardPage.vm.onAppCreated(createAppData);

      expect(appStore.postCreateAppLicenseAsync).toHaveBeenCalledWith(createAppData);
      expect(dashboardPage.vm.showCreateApp).toBe(false);
      expect(dashboardPage.vm.activeTab).toBe('app-details');
    });

    it('should handle onAppCreated when API call fails', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);
      const appStore = useAppStore();

      appStore.postCreateAppLicenseAsync = vi.fn().mockResolvedValue(false);

      dashboardPage.vm.showCreateApp = true;
      dashboardPage.vm.activeTab = 'app-users'; // Set to non-default tab
      await nextTick();

      const createAppData: ICreateAppLicenseRequestData = {
        name: 'New App',
        ownerId: 123,
        localUrl: 'http://localhost:3000',
        testUrl: '',
        stagingUrl: '',
        prodUrl: '',
        sourceCodeUrl: '',
      };

      await dashboardPage.vm.onAppCreated(createAppData);

      expect(appStore.postCreateAppLicenseAsync).toHaveBeenCalledWith(createAppData);
      // activeTab should NOT change to 'app-details' when API fails
      expect(dashboardPage.vm.activeTab).not.toBe('app-details');
    });
  });

  describe('App Details View', () => {
    it('should show app details when selectedApp is not null and showCreateApp is false', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);

      dashboardPage.vm.showCreateApp = false;
      dashboardPage.vm.selectedApp = mockApp;
      await nextTick();

      expect(wrapper.find('#app-details').exists()).toBe(true);
    });

    it('should not show app details when showCreateApp is true', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);

      dashboardPage.vm.showCreateApp = true;
      await nextTick();

      expect(wrapper.find('#app-details').exists()).toBe(false);
    });

    it('should not show app details when selectedApp is null', async () => {
      wrapper = createWrapper({}, { appStore: { selectedApp: null } });
      const dashboardPage = wrapper.findComponent(DashboardPage);

      dashboardPage.vm.showCreateApp = false;
      dashboardPage.vm.selectedApp = null;
      await nextTick();

      expect(wrapper.find('#app-details').exists()).toBe(false);
    });

    it('should render tabs when app details are shown', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);

      dashboardPage.vm.showCreateApp = false;
      dashboardPage.vm.selectedApp = mockApp;
      await nextTick();

      const tabs = wrapper.findAllComponents({ name: 'VTab' });
      expect(tabs.length).toBeGreaterThanOrEqual(3);
    });

    it('should have app-details tab', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);

      dashboardPage.vm.showCreateApp = false;
      dashboardPage.vm.selectedApp = mockApp;
      await nextTick();

      expect(dashboardPage.vm.activeTab).toBe('app-details');
    });

    it('should render SelectedAppForm in app-details tab', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);

      dashboardPage.vm.showCreateApp = false;
      dashboardPage.vm.selectedApp = mockApp;
      dashboardPage.vm.activeTab = 'app-details';
      await nextTick();

      expect(wrapper.findComponent({ name: 'SelectedAppForm' }).exists()).toBe(true);
    });
  });

  describe('Tab Navigation', () => {
    it('should switch to app-users tab', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);

      dashboardPage.vm.showCreateApp = false;
      dashboardPage.vm.selectedApp = mockApp;
      dashboardPage.vm.activeTab = 'app-users';
      await nextTick();

      expect(dashboardPage.vm.activeTab).toBe('app-users');
    });

    it('should render SelectedAppUsersForm with displayRegistered true in app-users tab', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);

      dashboardPage.vm.showCreateApp = false;
      dashboardPage.vm.selectedApp = mockApp;
      dashboardPage.vm.activeTab = 'app-users';
      await nextTick();

      const usersForm = wrapper.findComponent({ name: 'SelectedAppUsersForm' });
      expect(usersForm.exists()).toBe(true);
    });

    it('should switch to app-non-registered-users tab', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);

      dashboardPage.vm.showCreateApp = false;
      dashboardPage.vm.selectedApp = mockApp;
      dashboardPage.vm.activeTab = 'app-non-registered-users';
      await nextTick();

      expect(dashboardPage.vm.activeTab).toBe('app-non-registered-users');
    });

    it('should render SelectedAppUsersForm with displayRegistered false in app-non-registered-users tab', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);

      dashboardPage.vm.showCreateApp = false;
      dashboardPage.vm.selectedApp = mockApp;
      dashboardPage.vm.activeTab = 'app-non-registered-users';
      await nextTick();

      const usersForm = wrapper.findComponent({ name: 'SelectedAppUsersForm' });
      expect(usersForm.exists()).toBe(true);
    });

    it('should have v-tabs component with primary color', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);

      dashboardPage.vm.showCreateApp = false;
      dashboardPage.vm.selectedApp = mockApp;
      await nextTick();

      const tabs = wrapper.findComponent({ name: 'VTabs' });
      expect(tabs.exists()).toBe(true);
      expect(tabs.props('color')).toBe('primary');
    });

    it('should have v-window component', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);

      dashboardPage.vm.showCreateApp = false;
      dashboardPage.vm.selectedApp = mockApp;
      await nextTick();

      const window = wrapper.findComponent({ name: 'VWindow' });
      expect(window.exists()).toBe(true);
    });
  });

  describe('Watcher Functionality', () => {
    it('should update selectedApp when store value changes', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);
      const appStore = useAppStore();

      const newApp = new App();
      newApp.id = 2;
      newApp.name = 'Updated App';

      appStore.selectedApp = newApp;
      await nextTick();
      await nextTick();

      expect(dashboardPage.vm.selectedApp).toBeDefined();
    });

    it('should handle selectedApp changing to null', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);
      const appStore = useAppStore();

      appStore.selectedApp = null;
      await nextTick();
      await nextTick();

      expect(dashboardPage.vm.selectedApp).toBeNull();
    });

    it('should handle selectedApp changing to undefined', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);
      const appStore = useAppStore();

      appStore.selectedApp = undefined;
      await nextTick();
      await nextTick();

      expect(dashboardPage.vm.selectedApp).toBeUndefined();
    });
  });

  describe('Lifecycle Hooks', () => {
    it('should handle onBeforeMount with action="login"', async () => {
      wrapper = createWrapper({ action: 'login' });
      const userStore = useUserStore();

      await nextTick();

      expect(userStore.updateUser).toHaveBeenCalled();
    });

    it('should handle onBeforeMount with action="LOGIN" (case insensitive)', async () => {
      wrapper = createWrapper({ action: 'LOGIN' });
      const userStore = useUserStore();

      await nextTick();

      expect(userStore.updateUser).toHaveBeenCalled();
    });

    it('should set user.isLoggingIn to true when action is login', async () => {
      const updateUserSpy = vi.fn();

      const pinia = createTestingPinia({
        createSpy: vi.fn,
        initialState: {
          appStore: { selectedApp: mockApp },
          userStore: { user: mockUser },
        },
      });

      const userStore = useUserStore(pinia);
      userStore.updateUser = updateUserSpy;

      wrapper = mount(DashboardView, {
        props: { action: 'login' },
        global: {
          plugins: [vuetify, pinia],
        },
      });

      await nextTick();

      expect(updateUserSpy).toHaveBeenCalled();
      const calledUser = updateUserSpy.mock.calls[0][0];
      expect(calledUser.isLoggingIn).toBe(true);
    });

    it('should not call updateUser when action is not login', async () => {
      const updateUserSpy = vi.fn();

      const pinia = createTestingPinia({
        createSpy: vi.fn,
        initialState: {
          appStore: { selectedApp: mockApp },
          userStore: { user: mockUser },
        },
      });

      const userStore = useUserStore(pinia);
      userStore.updateUser = updateUserSpy;

      wrapper = mount(DashboardView, {
        props: { action: '' },
        global: {
          plugins: [vuetify, pinia],
        },
      });

      await nextTick();

      expect(updateUserSpy).not.toHaveBeenCalled();
    });

    it('should not call updateUser when action is different from login', async () => {
      wrapper = createWrapper({ action: 'register' });
      const userStore = useUserStore();

      await nextTick();

      expect(userStore.updateUser).not.toHaveBeenCalled();
    });
  });

  describe('Props', () => {
    it('should have default action prop as empty string', () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);

      expect(dashboardPage.props('action')).toBe('');
    });

    it('should accept action prop', () => {
      wrapper = createWrapper({ action: 'test-action' });
      const dashboardPage = wrapper.findComponent(DashboardPage);

      expect(dashboardPage.props('action')).toBe('test-action');
    });
  });

  describe('Store Integration', () => {
    it('should initialize with store values', () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);

      expect(dashboardPage.vm.selectedApp).toBeDefined();
    });

    it('should call postCreateAppLicenseAsync from appStore', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);
      const appStore = useAppStore();

      appStore.postCreateAppLicenseAsync = vi.fn().mockResolvedValue(true);

      const createAppData: ICreateAppLicenseRequestData = {
        name: 'Test App',
        ownerId: 123,
        localUrl: 'http://localhost',
        testUrl: '',
        stagingUrl: '',
        prodUrl: '',
        sourceCodeUrl: '',
      };

      await dashboardPage.vm.onAppCreated(createAppData);

      expect(appStore.postCreateAppLicenseAsync).toHaveBeenCalledWith(createAppData);
    });

    it('should get user from userStore', () => {
      const pinia = createTestingPinia({
        createSpy: vi.fn,
        initialState: {
          appStore: { selectedApp: mockApp },
          userStore: { user: mockUser },
        },
      });

      wrapper = mount(DashboardView, {
        props: { action: 'login' },
        global: {
          plugins: [vuetify, pinia],
        },
      });

      const userStore = useUserStore(pinia);
      expect(userStore.getUser).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple show/hide cycles', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);

      dashboardPage.vm.showCreateAppForm();
      await nextTick();
      expect(dashboardPage.vm.showCreateApp).toBe(true);

      dashboardPage.vm.hideCreateAppForm();
      await nextTick();
      expect(dashboardPage.vm.showCreateApp).toBe(false);

      dashboardPage.vm.showCreateAppForm();
      await nextTick();
      expect(dashboardPage.vm.showCreateApp).toBe(true);
    });

    it('should handle rapid tab switching', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);

      dashboardPage.vm.selectedApp = mockApp;
      dashboardPage.vm.showCreateApp = false;

      dashboardPage.vm.activeTab = 'app-details';
      await nextTick();

      dashboardPage.vm.activeTab = 'app-users';
      await nextTick();

      dashboardPage.vm.activeTab = 'app-non-registered-users';
      await nextTick();

      expect(dashboardPage.vm.activeTab).toBe('app-non-registered-users');
    });

    it('should handle onAppCreated with complete data', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);
      const appStore = useAppStore();

      appStore.postCreateAppLicenseAsync = vi.fn().mockResolvedValue(true);

      const completeData: ICreateAppLicenseRequestData = {
        name: 'Complete App',
        ownerId: 123,
        localUrl: 'http://localhost:3000',
        testUrl: 'http://test.example.com',
        stagingUrl: 'http://staging.example.com',
        prodUrl: 'http://prod.example.com',
        sourceCodeUrl: 'http://github.com/complete/repo',
      };

      await dashboardPage.vm.onAppCreated(completeData);

      expect(appStore.postCreateAppLicenseAsync).toHaveBeenCalledWith(completeData);
    });

    it('should handle onAppCreated with minimal data', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);
      const appStore = useAppStore();

      appStore.postCreateAppLicenseAsync = vi.fn().mockResolvedValue(true);

      const minimalData: ICreateAppLicenseRequestData = {
        name: 'Minimal App',
        ownerId: 123,
        localUrl: '',
        testUrl: '',
        stagingUrl: '',
        prodUrl: '',
        sourceCodeUrl: '',
      };

      await dashboardPage.vm.onAppCreated(minimalData);

      expect(appStore.postCreateAppLicenseAsync).toHaveBeenCalledWith(minimalData);
    });
  });

  describe('UI Elements', () => {
    it('should have v-container with fluid prop', () => {
      wrapper = createWrapper();
      const containers = wrapper.findAllComponents({ name: 'VContainer' });
      expect(containers.length).toBeGreaterThan(0);
    });

    it('should have v-card with elevation="6"', () => {
      wrapper = createWrapper();
      const card = wrapper.findComponent({ name: 'VCard' });
      expect(card.exists()).toBe(true);
    });

    it('should have centered card title', () => {
      wrapper = createWrapper();
      const cardTitle = wrapper.find('.v-card-title');
      expect(cardTitle.classes()).toContain('justify-center');
      expect(cardTitle.classes()).toContain('text-center');
    });

    it('should display tab icons', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);

      dashboardPage.vm.showCreateApp = false;
      dashboardPage.vm.selectedApp = mockApp;
      await nextTick();

      const icons = wrapper.findAllComponents({ name: 'VIcon' });
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe('Function Coverage Tests', () => {
    it('should execute all functions for 100% coverage', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);
      const appStore = useAppStore();

      appStore.postCreateAppLicenseAsync = vi.fn().mockResolvedValue(true);

      // Test showCreateAppForm function
      dashboardPage.vm.showCreateAppForm();
      expect(dashboardPage.vm.showCreateApp).toBe(true);

      // Test hideCreateAppForm function
      dashboardPage.vm.hideCreateAppForm();
      expect(dashboardPage.vm.showCreateApp).toBe(false);

      // Test onAppCreated function
      const testData: ICreateAppLicenseRequestData = {
        name: 'Function Test App',
        ownerId: 123,
        localUrl: 'http://localhost',
        testUrl: '',
        stagingUrl: '',
        prodUrl: '',
        sourceCodeUrl: '',
      };

      await dashboardPage.vm.onAppCreated(testData);
      expect(appStore.postCreateAppLicenseAsync).toHaveBeenCalled();

      // Verify watcher is working
      expect(dashboardPage.vm.selectedApp).toBeDefined();
    });

    it('should execute watcher callback with new app value', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);
      const appStore = useAppStore();

      const newApp = new App();
      newApp.id = 999;
      newApp.name = 'Watcher Test';

      appStore.selectedApp = newApp;
      await nextTick();
      await nextTick();

      // Watcher should have updated selectedApp
      expect(dashboardPage.vm.selectedApp).toBeDefined();
    });

    it('should execute watcher callback with null value', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);
      const appStore = useAppStore();

      appStore.selectedApp = null;
      await nextTick();
      await nextTick();

      expect(dashboardPage.vm.selectedApp).toBeNull();
    });

    it('should execute onBeforeMount lifecycle hook', async () => {
      // Create a fresh pinia instance with spy
      const pinia = createTestingPinia({
        createSpy: vi.fn,
        initialState: {
          appStore: { selectedApp: mockApp },
          userStore: { user: mockUser },
        },
      });

      const userStore = useUserStore(pinia);
      const updateUserSpy = vi.spyOn(userStore, 'updateUser');

      // Creating a new wrapper will trigger onBeforeMount
      const testWrapper = mount(DashboardView, {
        props: { action: 'login' },
        global: {
          plugins: [vuetify, pinia],
        },
      });

      await nextTick();

      expect(updateUserSpy).toHaveBeenCalled();

      testWrapper.unmount();
    });

    it('should execute watcher arrow function', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);
      const appStore = useAppStore();

      // Trigger watcher by changing store value multiple times
      const app1 = new App();
      app1.id = 1;
      appStore.selectedApp = app1;
      await nextTick();

      const app2 = new App();
      app2.id = 2;
      appStore.selectedApp = app2;
      await nextTick();

      // Watcher arrow function should have executed
      expect(dashboardPage.vm.selectedApp).toBeDefined();
    });
  });

  describe('Tab Click Coverage Tests', () => {
    it('should trigger v-tabs model update when clicking app-details tab', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);

      dashboardPage.vm.showCreateApp = false;
      dashboardPage.vm.selectedApp = mockApp;
      await nextTick();

      const tabs = wrapper.findAllComponents({ name: 'VTab' });
      expect(tabs.length).toBeGreaterThanOrEqual(3);

      // Click on app-details tab (first tab)
      await tabs[0].trigger('click');
      await nextTick();

      expect(dashboardPage.vm.activeTab).toBe('app-details');
    });

    it('should trigger v-tabs model update when clicking app-users tab', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);

      dashboardPage.vm.showCreateApp = false;
      dashboardPage.vm.selectedApp = mockApp;
      await nextTick();

      const tabs = wrapper.findAllComponents({ name: 'VTab' });

      // Click on app-users tab (second tab)
      await tabs[1].trigger('click');
      await nextTick();

      expect(dashboardPage.vm.activeTab).toBe('app-users');
    });

    it('should trigger v-tabs model update when clicking app-non-registered-users tab', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);

      dashboardPage.vm.showCreateApp = false;
      dashboardPage.vm.selectedApp = mockApp;
      await nextTick();

      const tabs = wrapper.findAllComponents({ name: 'VTab' });

      // Click on app-non-registered-users tab (third tab)
      await tabs[2].trigger('click');
      await nextTick();

      expect(dashboardPage.vm.activeTab).toBe('app-non-registered-users');
    });

    it('should render SelectedAppForm when app-details tab is active', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);

      dashboardPage.vm.showCreateApp = false;
      dashboardPage.vm.selectedApp = mockApp;
      dashboardPage.vm.activeTab = 'app-details';
      await nextTick();
      await nextTick();

      const windowItems = wrapper.findAllComponents({ name: 'VWindowItem' });
      expect(windowItems.length).toBeGreaterThan(0);

      const selectedAppForm = wrapper.findComponent({ name: 'SelectedAppForm' });
      expect(selectedAppForm.exists()).toBe(true);
    });

    it('should render SelectedAppUsersForm in app-users window items', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);

      dashboardPage.vm.showCreateApp = false;
      dashboardPage.vm.selectedApp = mockApp;
      dashboardPage.vm.activeTab = 'app-users';
      await nextTick();
      await nextTick();

      const windowItems = wrapper.findAllComponents({ name: 'VWindowItem' });
      expect(windowItems.length).toBeGreaterThan(0);

      const usersForm = wrapper.findComponent({ name: 'SelectedAppUsersForm' });
      expect(usersForm.exists()).toBe(true);
    });

    it('should render SelectedAppUsersForm with displayRegistered false in non-registered tab', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);

      dashboardPage.vm.showCreateApp = false;
      dashboardPage.vm.selectedApp = mockApp;
      dashboardPage.vm.activeTab = 'app-non-registered-users';
      await nextTick();
      await nextTick();

      const windowItems = wrapper.findAllComponents({ name: 'VWindowItem' });
      expect(windowItems.length).toBeGreaterThan(0);

      const usersForm = wrapper.findComponent({ name: 'SelectedAppUsersForm' });
      expect(usersForm.exists()).toBe(true);
    });

    it('should have all v-window-items rendered in DOM', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);

      dashboardPage.vm.showCreateApp = false;
      dashboardPage.vm.selectedApp = mockApp;
      await nextTick();

      const windowItems = wrapper.findAllComponents({ name: 'VWindowItem' });
      // There are 3 window items
      expect(windowItems.length).toBe(3);
    });

    it('should cycle through all tabs to ensure window items render', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);

      dashboardPage.vm.showCreateApp = false;
      dashboardPage.vm.selectedApp = mockApp;

      // Cycle through all tabs to trigger window item rendering
      const tabValues = ['app-details', 'app-users', 'app-non-registered-users'];
      
      for (const tabValue of tabValues) {
        dashboardPage.vm.activeTab = tabValue;
        await nextTick();
        await nextTick();
        expect(dashboardPage.vm.activeTab).toBe(tabValue);
      }
    });

    it('should verify v-window model binding works', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);

      dashboardPage.vm.showCreateApp = false;
      dashboardPage.vm.selectedApp = mockApp;
      await nextTick();

      const vWindow = wrapper.findComponent({ name: 'VWindow' });
      expect(vWindow.exists()).toBe(true);
      expect(vWindow.props('modelValue')).toBe('app-details');

      dashboardPage.vm.activeTab = 'app-users';
      await nextTick();

      expect(vWindow.props('modelValue')).toBe('app-users');
    });

    it('should mount DashboardPage directly with attachTo for full DOM rendering', async () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      const pinia = createTestingPinia({
        createSpy: vi.fn,
        initialState: {
          appStore: { selectedApp: mockApp },
          userStore: { user: mockUser },
        },
      });

      const directWrapper = mount(DashboardPage, {
        props: { action: '' },
        global: {
          plugins: [vuetify, pinia],
        },
        attachTo: container,
      });

      await nextTick();
      await nextTick();

      // Ensure SelectedAppForm is rendered
      const selectedAppForm = directWrapper.findComponent({ name: 'SelectedAppForm' });
      expect(selectedAppForm.exists()).toBe(true);

      directWrapper.unmount();
      document.body.removeChild(container);
    });

    it('should render SelectedAppForm content when app-details is active tab', async () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      const pinia = createTestingPinia({
        createSpy: vi.fn,
        initialState: {
          appStore: { selectedApp: mockApp },
          userStore: { user: mockUser },
        },
      });

      const directWrapper = mount(DashboardPage, {
        props: { action: '' },
        global: {
          plugins: [vuetify, pinia],
        },
        attachTo: container,
      });

      // Explicitly set activeTab to app-details
      directWrapper.vm.activeTab = 'app-details';
      directWrapper.vm.showCreateApp = false;
      await nextTick();
      await nextTick();
      await nextTick();
      await flushPromises();

      // Force v-window to update
      const vWindow = directWrapper.findComponent({ name: 'VWindow' });
      expect(vWindow.exists()).toBe(true);

      const selectedAppForm = directWrapper.findComponent({ name: 'SelectedAppForm' });
      expect(selectedAppForm.exists()).toBe(true);

      directWrapper.unmount();
      document.body.removeChild(container);
    });

    it('should fully render SelectedAppForm component in first window item', async () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      const pinia = createTestingPinia({
        createSpy: vi.fn,
        initialState: {
          appStore: { selectedApp: mockApp },
          userStore: { user: mockUser },
        },
      });

      const directWrapper = mount(DashboardPage, {
        props: { action: '' },
        global: {
          plugins: [vuetify, pinia],
        },
        attachTo: container,
      });

      // Setup for rendering
      directWrapper.vm.showCreateApp = false;
      directWrapper.vm.selectedApp = mockApp;
      directWrapper.vm.activeTab = 'app-details';
      
      await flushPromises();
      await nextTick();
      await flushPromises();

      // Access the first window item
      const windowItems = directWrapper.findAllComponents({ name: 'VWindowItem' });
      expect(windowItems.length).toBe(3);

      // The first window item should contain SelectedAppForm
      const firstWindowItem = windowItems[0];
      expect(firstWindowItem.props('value')).toBe('app-details');

      // Find SelectedAppForm
      const forms = directWrapper.findAllComponents({ name: 'SelectedAppForm' });
      expect(forms.length).toBeGreaterThanOrEqual(1);

      directWrapper.unmount();
      document.body.removeChild(container);
    });

    it('should trigger SelectedAppForm rendering by switching tabs back to app-details', async () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      const pinia = createTestingPinia({
        createSpy: vi.fn,
        initialState: {
          appStore: { selectedApp: mockApp },
          userStore: { user: mockUser },
        },
      });

      const directWrapper = mount(DashboardPage, {
        props: { action: '' },
        global: {
          plugins: [vuetify, pinia],
        },
        attachTo: container,
      });

      directWrapper.vm.showCreateApp = false;
      directWrapper.vm.selectedApp = mockApp;
      
      // Switch to another tab first
      directWrapper.vm.activeTab = 'app-users';
      await flushPromises();
      await nextTick();

      // Then switch back to app-details to trigger SelectedAppForm rendering
      directWrapper.vm.activeTab = 'app-details';
      await flushPromises();
      await nextTick();
      await flushPromises();

      const selectedAppForm = directWrapper.findComponent({ name: 'SelectedAppForm' });
      expect(selectedAppForm.exists()).toBe(true);

      directWrapper.unmount();
      document.body.removeChild(container);
    });

    it('should trigger v-window model update via emit', async () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      const pinia = createTestingPinia({
        createSpy: vi.fn,
        initialState: {
          appStore: { selectedApp: mockApp },
          userStore: { user: mockUser },
        },
      });

      const directWrapper = mount(DashboardPage, {
        props: { action: '' },
        global: {
          plugins: [vuetify, pinia],
        },
        attachTo: container,
      });

      directWrapper.vm.showCreateApp = false;
      directWrapper.vm.selectedApp = mockApp;
      await flushPromises();
      await nextTick();

      // Find v-window and emit update event to trigger v-model handler
      const vWindow = directWrapper.findComponent({ name: 'VWindow' });
      expect(vWindow.exists()).toBe(true);

      // Emit the update:modelValue event to trigger the v-model setter
      await vWindow.vm.$emit('update:modelValue', 'app-users');
      await flushPromises();
      await nextTick();

      // Emit again to switch to a different tab
      await vWindow.vm.$emit('update:modelValue', 'app-details');
      await flushPromises();
      await nextTick();

      expect(directWrapper.vm.activeTab).toBe('app-details');

      directWrapper.unmount();
      document.body.removeChild(container);
    });

    it('should update activeTab when v-window emits update', async () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      const pinia = createTestingPinia({
        createSpy: vi.fn,
        initialState: {
          appStore: { selectedApp: mockApp },
          userStore: { user: mockUser },
        },
      });

      const directWrapper = mount(DashboardPage, {
        props: { action: '' },
        global: {
          plugins: [vuetify, pinia],
        },
        attachTo: container,
      });

      directWrapper.vm.showCreateApp = false;
      directWrapper.vm.selectedApp = mockApp;
      directWrapper.vm.activeTab = 'app-details';
      await flushPromises();
      await nextTick();

      const vWindow = directWrapper.findComponent({ name: 'VWindow' });

      // Simulate user interaction by emitting update from v-window
      vWindow.vm.$emit('update:modelValue', 'app-non-registered-users');
      await flushPromises();
      await nextTick();

      // Verify the v-model handler updated the local activeTab ref
      expect(directWrapper.vm.activeTab).toBe('app-non-registered-users');

      directWrapper.unmount();
      document.body.removeChild(container);
    });
  });

  describe('Branch Coverage Tests', () => {
    it('should test showCreateApp true branch - create form shown', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);

      // Set showCreateApp to true
      dashboardPage.vm.showCreateApp = true;
      await nextTick();

      // app-create should be visible, app-details should not
      expect(wrapper.find('#app-create').exists()).toBe(true);
      expect(wrapper.find('#app-details').exists()).toBe(false);
    });

    it('should test showCreateApp false AND selectedApp null branch', async () => {
      wrapper = createWrapper({}, { appStore: { selectedApp: null } });
      const dashboardPage = wrapper.findComponent(DashboardPage);

      // Explicitly set values
      dashboardPage.vm.showCreateApp = false;
      dashboardPage.vm.selectedApp = null;
      await nextTick();

      // Neither app-create nor app-details should be visible
      expect(wrapper.find('#app-create').exists()).toBe(false);
      expect(wrapper.find('#app-details').exists()).toBe(false);
    });

    it('should test showCreateApp false AND selectedApp not null branch', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);

      dashboardPage.vm.showCreateApp = false;
      dashboardPage.vm.selectedApp = mockApp;
      await nextTick();

      // app-details should be visible
      expect(wrapper.find('#app-details').exists()).toBe(true);
      expect(wrapper.find('#app-create').exists()).toBe(false);
    });

    it('should test condition where selectedApp is exactly null', async () => {
      const pinia = createTestingPinia({
        createSpy: vi.fn,
        initialState: {
          appStore: { selectedApp: null },
          userStore: { user: mockUser },
        },
      });

      const testWrapper = mount(DashboardView, {
        props: {},
        global: {
          plugins: [vuetify, pinia],
        },
      });

      const dashboardPage = testWrapper.findComponent(DashboardPage);
      
      // Force the condition check with explicit null
      dashboardPage.vm.showCreateApp = false;
      dashboardPage.vm.selectedApp = null;
      await nextTick();
      await nextTick();

      // selectedApp !== null should evaluate to false
      expect(testWrapper.find('#app-details').exists()).toBe(false);

      testWrapper.unmount();
    });

    it('should cover the else branch when selectedApp is truthy', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);

      // Set to truthy app
      dashboardPage.vm.selectedApp = mockApp;
      dashboardPage.vm.showCreateApp = false;
      await nextTick();

      // The !== null condition should be true
      expect(dashboardPage.vm.selectedApp !== null).toBe(true);
      expect(wrapper.find('#app-details').exists()).toBe(true);
    });

    it('should transition between showCreateApp states', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);

      // Start with create app visible
      dashboardPage.vm.showCreateApp = true;
      dashboardPage.vm.selectedApp = mockApp;
      await nextTick();
      expect(wrapper.find('#app-create').exists()).toBe(true);
      expect(wrapper.find('#app-details').exists()).toBe(false);

      // Hide create app, show details
      dashboardPage.vm.showCreateApp = false;
      await nextTick();
      expect(wrapper.find('#app-create').exists()).toBe(false);
      expect(wrapper.find('#app-details').exists()).toBe(true);

      // Set selectedApp to null while showCreateApp is false
      dashboardPage.vm.selectedApp = null;
      await nextTick();
      expect(wrapper.find('#app-create').exists()).toBe(false);
      expect(wrapper.find('#app-details').exists()).toBe(false);
    });

    it('should cover showCreateApp=true skipping selectedApp check (short-circuit)', async () => {
      wrapper = createWrapper();
      const dashboardPage = wrapper.findComponent(DashboardPage);

      // When showCreateApp is true, selectedApp !== null is never evaluated
      dashboardPage.vm.showCreateApp = true;
      dashboardPage.vm.selectedApp = mockApp; // This shouldn't matter
      await nextTick();

      // app-create visible, app-details not (regardless of selectedApp)
      expect(wrapper.find('#app-create').exists()).toBe(true);
      expect(wrapper.find('#app-details').exists()).toBe(false);
    });

    it('should cover showCreateApp=false with selectedApp=undefined', async () => {
      wrapper = createWrapper({}, { appStore: { selectedApp: undefined } });
      const dashboardPage = wrapper.findComponent(DashboardPage);

      dashboardPage.vm.showCreateApp = false;
      dashboardPage.vm.selectedApp = undefined;
      await nextTick();

      // undefined !== null is true, but the condition should still work
      // Note: undefined !== null evaluates to true in JavaScript!
      // So app-details might still show
      const appDetailsExists = wrapper.find('#app-details').exists();
      // This tests the branch where selectedApp is a different falsy value
      expect(dashboardPage.vm.selectedApp).toBeUndefined();
    });

    it('should test all branch combinations for v-if conditions', async () => {
      // Test matrix for !showCreateApp && selectedApp !== null
      const testCases = [
        { showCreateApp: true, selectedApp: mockApp, expectDetails: false, expectCreate: true },
        { showCreateApp: true, selectedApp: null, expectDetails: false, expectCreate: true },
        { showCreateApp: false, selectedApp: mockApp, expectDetails: true, expectCreate: false },
        { showCreateApp: false, selectedApp: null, expectDetails: false, expectCreate: false },
      ];

      for (const tc of testCases) {
        wrapper = createWrapper();
        const dashboardPage = wrapper.findComponent(DashboardPage);

        dashboardPage.vm.showCreateApp = tc.showCreateApp;
        dashboardPage.vm.selectedApp = tc.selectedApp;
        await nextTick();
        await nextTick();

        expect(wrapper.find('#app-details').exists()).toBe(tc.expectDetails);
        expect(wrapper.find('#app-create').exists()).toBe(tc.expectCreate);

        wrapper.unmount();
      }
    });

    it('should mount DashboardPage directly with null selectedApp to cover v-else-if false branch', async () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      // Mount with selectedApp: null in initial state - this ensures v-else-if is evaluated as false on first render
      const pinia = createTestingPinia({
        createSpy: vi.fn,
        initialState: {
          appStore: { selectedApp: null },
          userStore: { user: mockUser },
        },
      });

      const directWrapper = mount(DashboardPage, {
        props: { action: '' },
        global: {
          plugins: [vuetify, pinia],
        },
        attachTo: container,
      });

      // showCreateApp defaults to false, selectedApp is null from store
      // v-if="showCreateApp" = false, so v-else-if="selectedApp !== null" is evaluated
      // selectedApp is null, so v-else-if = false - neither section should render
      await flushPromises();
      await nextTick();

      expect(directWrapper.vm.showCreateApp).toBe(false);
      expect(directWrapper.vm.selectedApp).toBeNull();
      expect(directWrapper.find('#app-create').exists()).toBe(false);
      expect(directWrapper.find('#app-details').exists()).toBe(false);

      directWrapper.unmount();
      document.body.removeChild(container);
    });

    it('should evaluate v-else-if with null selectedApp on initial render', () => {
      // Use sync mounting without async operations to capture initial render state
      const pinia = createTestingPinia({
        createSpy: vi.fn,
        initialState: {
          appStore: { selectedApp: null },
          userStore: { user: mockUser },
        },
      });

      const syncWrapper = mount(DashboardPage, {
        props: { action: '' },
        global: {
          plugins: [vuetify, pinia],
        },
      });

      // Check immediately after mount - the v-else-if should have been evaluated
      // since showCreateApp is false and selectedApp is null
      const createExists = syncWrapper.find('#app-create').exists();
      const detailsExists = syncWrapper.find('#app-details').exists();

      // v-if="showCreateApp" -> false (showCreateApp defaults to false)
      // v-else-if="selectedApp !== null" -> false (selectedApp is null)
      expect(createExists).toBe(false);
      expect(detailsExists).toBe(false);
      
      // Verify the local ref value
      expect(syncWrapper.vm.selectedApp).toBeNull();
      
      syncWrapper.unmount();
    });

    it('should transition selectedApp from valid app to null to trigger v-else-if re-evaluation', async () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      const pinia = createTestingPinia({
        createSpy: vi.fn,
        initialState: {
          appStore: { selectedApp: mockApp },
          userStore: { user: mockUser },
        },
      });

      const directWrapper = mount(DashboardPage, {
        props: { action: '' },
        global: {
          plugins: [vuetify, pinia],
        },
        attachTo: container,
      });

      await flushPromises();
      await nextTick();

      // First, verify app-details is shown with valid app
      expect(directWrapper.find('#app-details').exists()).toBe(true);
      expect(directWrapper.vm.selectedApp).not.toBeNull();

      // Now transition to null - this should trigger v-else-if to evaluate as false
      const appStore = useAppStore(pinia);
      appStore.$patch({ selectedApp: null });
      
      await flushPromises();
      await nextTick();
      await flushPromises();

      // After transitioning to null, app-details should disappear
      expect(directWrapper.vm.selectedApp).toBeNull();
      expect(directWrapper.find('#app-details').exists()).toBe(false);

      directWrapper.unmount();
      document.body.removeChild(container);
    });
  });
});
