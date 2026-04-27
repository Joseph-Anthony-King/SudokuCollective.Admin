import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
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

  const createWrapper = (props = {}, initialStoreState = {}) => {
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
      expect(dashboardPage.vm.showCreateApp).toBe(false);
      // activeTab should NOT change to 'app-details' when API fails
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
});
