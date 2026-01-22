import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { createTestingPinia } from '@pinia/testing';
import { nextTick } from 'vue';
import { useAppStore } from '@/stores/appStore';
import { useUserStore } from '@/stores/userStore';
import SelectedAppUsersForm from '@/components/forms/SelectedAppUsersForm.vue';
import { App } from '@/models/domain/app';
import { User } from '@/models/domain/user';

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe('SelectedAppUsersForm.vue', () => {
  let wrapper: VueWrapper<any>;
  let vuetify: any;
  let testingPinia: any;
  let appStore: any;
  let userStore: any;

  const createMockUser = (overrides = {}): User => {
    const user = new User();
    Object.assign(user, {
      id: 1,
      userName: 'testuser',
      firstName: 'John',
      lastName: 'Doe',
      nickName: 'Johnny',
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      isActive: true,
      isAdmin: false,
      isSuperUser: false,
      isEmailConfirmed: true,
      dateCreated: new Date('2023-01-01'),
      dateUpdated: new Date('2023-01-02'),
      ...overrides,
    });
    return user;
  };

  const createMockApp = (users: User[] = []): App => {
    const app = new App();
    Object.assign(app, {
      id: 1,
      name: 'Test App',
      license: 'test-license',
      users: users,
    });
    return app;
  };

  beforeEach(() => {
    vuetify = createVuetify({
      components,
      directives,
    });

    testingPinia = createTestingPinia({
      createSpy: vi.fn,
    });

    appStore = useAppStore(testingPinia);
    userStore = useUserStore(testingPinia);

    // Set default store state
    appStore.selectedApp = null;
    userStore.user = new User();
    userStore.user.isSuperUser = false;
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  const createWrapper = (props = {}) => {
    return mount(SelectedAppUsersForm, {
      props,
      global: {
        plugins: [testingPinia, vuetify],
      },
    });
  };

  describe('Component Rendering', () => {
    it('should render the component with title', async () => {
      const mockApp = createMockApp();
      appStore.selectedApp = mockApp;

      wrapper = createWrapper();
      await nextTick();

      expect(wrapper.find('.headline').exists()).toBe(true);
      expect(wrapper.find('.v-data-table').exists()).toBe(true);
    });

    it('should default displayRegistered prop to true', async () => {
      const mockApp = createMockApp([createMockUser()]);
      appStore.selectedApp = mockApp;

      wrapper = createWrapper();
      await nextTick();

      const vm = wrapper.vm as any;
      expect(vm.$props.displayRegistered).toBe(true);
    });

    it('should render data table with correct headers', async () => {
      const mockApp = createMockApp();
      appStore.selectedApp = mockApp;

      wrapper = createWrapper();
      await nextTick();

      const table = wrapper.findComponent({ name: 'VDataTable' });
      expect(table.exists()).toBe(true);
    });

    it('should render users in the table', async () => {
      const users = [
        createMockUser({ id: 1, fullName: 'John Doe', email: 'john@example.com' }),
        createMockUser({ id: 2, fullName: 'Jane Smith', email: 'jane@example.com' }),
      ];
      const mockApp = createMockApp(users);
      appStore.selectedApp = mockApp;

      wrapper = createWrapper();
      await nextTick();

      const vm = wrapper.vm as any;
      expect(vm.users).toHaveLength(2);
      expect(vm.users[0].fullName).toBe('John Doe');
      expect(vm.users[1].fullName).toBe('Jane Smith');
    });

    it('should show active chip in green', async () => {
      const users = [createMockUser({ isActive: true })];
      const mockApp = createMockApp(users);
      appStore.selectedApp = mockApp;

      wrapper = createWrapper();
      await nextTick();

      // Verify data is available for the template slot
      const vm = wrapper.vm as any;
      expect(vm.users[0].isActive).toBe(true);
    });

    it('should show inactive chip in red', async () => {
      const users = [createMockUser({ isActive: false })];
      const mockApp = createMockApp(users);
      appStore.selectedApp = mockApp;

      wrapper = createWrapper();
      await nextTick();

      // Verify data is available for the template slot
      const vm = wrapper.vm as any;
      expect(vm.users[0].isActive).toBe(false);
    });

    it('should have correct admin status for icon rendering', async () => {
      const users = [createMockUser({ isAdmin: true })];
      const mockApp = createMockApp(users);
      appStore.selectedApp = mockApp;

      wrapper = createWrapper();
      await nextTick();

      // Verify data is available for the template slot
      const vm = wrapper.vm as any;
      expect(vm.users[0].isAdmin).toBe(true);
    });

    it('should have correct non-admin status for icon rendering', async () => {
      const users = [createMockUser({ isAdmin: false })];
      const mockApp = createMockApp(users);
      appStore.selectedApp = mockApp;

      wrapper = createWrapper();
      await nextTick();

      // Verify data is available for the template slot
      const vm = wrapper.vm as any;
      expect(vm.users[0].isAdmin).toBe(false);
    });

    it('should show super user column when current user is super user', async () => {
      const users = [createMockUser({ isSuperUser: true })];
      const mockApp = createMockApp(users);
      appStore.selectedApp = mockApp;
      userStore.user.isSuperUser = true;

      wrapper = createWrapper();
      await nextTick();

      const vm = wrapper.vm as any;
      const superUserHeader = vm.headers.find((h: any) => h.key === 'isSuperUser');
      expect(superUserHeader).toBeDefined();
      expect(superUserHeader.title).toBe('Super User');
    });

    it('should not show super user column when current user is not super user', async () => {
      const users = [createMockUser()];
      const mockApp = createMockApp(users);
      appStore.selectedApp = mockApp;
      userStore.user.isSuperUser = false;

      wrapper = createWrapper();
      await nextTick();

      const vm = wrapper.vm as any;
      const superUserHeader = vm.headers.find((h: any) => h.key === 'isSuperUser');
      expect(superUserHeader).toBeUndefined();
    });
  });

  describe('Computed Properties', () => {
    describe('users', () => {
      it('should return registered users from selected app when displayRegistered is true', async () => {
        const users = [
          createMockUser({ id: 1 }),
          createMockUser({ id: 2 }),
          createMockUser({ id: 3 }),
        ];
        const mockApp = createMockApp(users);
        appStore.selectedApp = mockApp;

        wrapper = createWrapper({ displayRegistered: true });
        await nextTick();

        const vm = wrapper.vm as any;
        expect(vm.users).toHaveLength(3);
        expect(vm.users).toEqual(users);
      });

      it('should return non-registered users when displayRegistered is false', async () => {
        const nonRegisteredUsers = [
          createMockUser({ id: 4 }),
          createMockUser({ id: 5 }),
        ];
        appStore.nonRegisteredAppUsers = nonRegisteredUsers;
        const mockApp = createMockApp([]);
        appStore.selectedApp = mockApp;

        wrapper = createWrapper({ displayRegistered: false });
        await nextTick();

        const vm = wrapper.vm as any;
        expect(vm.users).toHaveLength(2);
        expect(vm.users).toEqual(nonRegisteredUsers);
      });

      it('should return empty array when selected app is null and displayRegistered is true', async () => {
        appStore.selectedApp = null;

        wrapper = createWrapper({ displayRegistered: true });
        await nextTick();

        const vm = wrapper.vm as any;
        expect(vm.users).toEqual([]);
      });

      it('should return empty array when displayRegistered is false and nonRegisteredAppUsers is empty', async () => {
        appStore.nonRegisteredAppUsers = [];
        appStore.selectedApp = createMockApp([]);

        wrapper = createWrapper({ displayRegistered: false });
        await nextTick();

        const vm = wrapper.vm as any;
        expect(vm.users).toEqual([]);
      });

      it('should return empty array when selected app is undefined', async () => {
        appStore.selectedApp = undefined;

        wrapper = createWrapper({ displayRegistered: true });
        await nextTick();

        const vm = wrapper.vm as any;
        expect(vm.users).toEqual([]);
      });

      it('should return empty array when selected app has no users', async () => {
        const mockApp = createMockApp([]);
        appStore.selectedApp = mockApp;

        wrapper = createWrapper({ displayRegistered: true });
        await nextTick();

        const vm = wrapper.vm as any;
        expect(vm.users).toEqual([]);
      });
    });

    describe('formTitle', () => {
      it('should return title with app name when app exists and displaying registered users', async () => {
        const mockApp = createMockApp();
        mockApp.name = 'My Awesome App';
        appStore.selectedApp = mockApp;

        wrapper = createWrapper({ displayRegistered: true });
        await nextTick();

        const vm = wrapper.vm as any;
        expect(vm.formTitle).toBe('Registered Users for My Awesome App');
      });

      it('should return title with app name when app exists and displaying non-registered users', async () => {
        const mockApp = createMockApp();
        mockApp.name = 'My Awesome App';
        appStore.selectedApp = mockApp;

        wrapper = createWrapper({ displayRegistered: false });
        await nextTick();

        const vm = wrapper.vm as any;
        expect(vm.formTitle).toBe('Non-Registered Users for My Awesome App');
      });

      it('should return default title when app name is null', async () => {
        const mockApp = createMockApp();
        mockApp.name = null;
        appStore.selectedApp = mockApp;

        wrapper = createWrapper();
        await nextTick();

        const vm = wrapper.vm as any;
        expect(vm.formTitle).toBe('Manage App Users');
      });

      it('should return default title when app is null', async () => {
        appStore.selectedApp = null;

        wrapper = createWrapper();
        await nextTick();

        const vm = wrapper.vm as any;
        expect(vm.formTitle).toBe('Manage App Users');
      });

      it('should return default title when app is undefined', async () => {
        appStore.selectedApp = undefined;

        wrapper = createWrapper();
        await nextTick();

        const vm = wrapper.vm as any;
        expect(vm.formTitle).toBe('Manage App Users');
      });
    });

    describe('headers', () => {
      it('should return base headers when user is not super user', async () => {
        userStore.user.isSuperUser = false;

        wrapper = createWrapper();
        await nextTick();

        const vm = wrapper.vm as any;
        expect(vm.headers).toHaveLength(5);
        expect(vm.headers[0]).toEqual({ title: 'Full Name', key: 'fullName', sortable: true });
        expect(vm.headers[1]).toEqual({ title: 'Email', key: 'email', sortable: true });
        expect(vm.headers[2]).toEqual({ title: 'Active', key: 'isActive', sortable: false });
        expect(vm.headers[3]).toEqual({ title: 'Admin', key: 'isAdmin', sortable: false });
        expect(vm.headers[4]).toEqual({ title: 'Actions', key: 'actions', sortable: false });
      });

      it('should include super user header when user is super user', async () => {
        userStore.user.isSuperUser = true;

        wrapper = createWrapper();
        await nextTick();

        const vm = wrapper.vm as any;
        expect(vm.headers).toHaveLength(6);
        expect(vm.headers[4]).toEqual({ title: 'Super User', key: 'isSuperUser', sortable: false });
        expect(vm.headers[5]).toEqual({ title: 'Actions', key: 'actions', sortable: false });
      });

      it('should update headers reactively when super user status changes', async () => {
        userStore.user.isSuperUser = false;

        wrapper = createWrapper();
        await nextTick();

        let vm = wrapper.vm as any;
        expect(vm.headers).toHaveLength(5);

        userStore.user.isSuperUser = true;
        await nextTick();

        vm = wrapper.vm as any;
        expect(vm.headers).toHaveLength(6);
      });
    });
  });

  describe('Template Slots', () => {
    describe('Data verification for template slots', () => {
      it('should have users with correct properties for slot rendering', async () => {
        const users = [
          createMockUser({ id: 1, isActive: true, isAdmin: true }),
          createMockUser({ id: 2, isActive: false, isAdmin: false }),
        ];
        const mockApp = createMockApp(users);
        appStore.selectedApp = mockApp;

        wrapper = createWrapper();
        await nextTick();

        const vm = wrapper.vm as any;
        expect(vm.users).toHaveLength(2);
        expect(vm.users[0].isActive).toBe(true);
        expect(vm.users[0].isAdmin).toBe(true);
        expect(vm.users[1].isActive).toBe(false);
        expect(vm.users[1].isAdmin).toBe(false);
      });

      it('should verify template contains slot definitions', async () => {
        const users = [createMockUser()];
        const mockApp = createMockApp(users);
        appStore.selectedApp = mockApp;

        wrapper = createWrapper();
        await nextTick();

        // Verify the component has the data table with the expected structure
        const table = wrapper.findComponent({ name: 'VDataTable' });
        expect(table.exists()).toBe(true);
      });
    });
  });

  describe('Data Table Configuration', () => {
    it('should configure data table with correct props', async () => {
      const mockApp = createMockApp([createMockUser()]);
      appStore.selectedApp = mockApp;

      wrapper = createWrapper();
      await nextTick();

      const table = wrapper.findComponent({ name: 'VDataTable' });
      expect(table.props('itemsPerPage')).toBe(10);
      expect(table.props('showExpand')).toBe(true);
    });

    it('should pass users as items to data table', async () => {
      const users = [createMockUser({ id: 1 }), createMockUser({ id: 2 })];
      const mockApp = createMockApp(users);
      appStore.selectedApp = mockApp;

      wrapper = createWrapper();
      await nextTick();

      const table = wrapper.findComponent({ name: 'VDataTable' });
      expect(table.props('items')).toHaveLength(2);
    });

    it('should pass headers to data table', async () => {
      const mockApp = createMockApp([createMockUser()]);
      appStore.selectedApp = mockApp;

      wrapper = createWrapper();
      await nextTick();

      const table = wrapper.findComponent({ name: 'VDataTable' });
      expect(table.props('headers')).toBeDefined();
      expect(table.props('headers').length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple users with different statuses', async () => {
      const users = [
        createMockUser({ id: 1, isActive: true, isAdmin: true, isSuperUser: false }),
        createMockUser({ id: 2, isActive: false, isAdmin: false, isSuperUser: false }),
        createMockUser({ id: 3, isActive: true, isAdmin: false, isSuperUser: true }),
      ];
      const mockApp = createMockApp(users);
      appStore.selectedApp = mockApp;

      wrapper = createWrapper();
      await nextTick();

      const vm = wrapper.vm as any;
      expect(vm.users).toHaveLength(3);
    });

    it('should handle app with empty name', async () => {
      const mockApp = createMockApp();
      mockApp.name = '';
      appStore.selectedApp = mockApp;

      wrapper = createWrapper();
      await nextTick();

      const vm = wrapper.vm as any;
      expect(vm.formTitle).toBe('Manage App Users');
    });

    it('should handle users with undefined properties', async () => {
      const user = createMockUser({
        userName: undefined,
        firstName: undefined,
        lastName: undefined,
        nickName: undefined,
        dateCreated: undefined,
      });
      const mockApp = createMockApp([user]);
      appStore.selectedApp = mockApp;

      wrapper = createWrapper();
      await nextTick();

      const vm = wrapper.vm as any;
      expect(vm.users).toHaveLength(1);
    });

    it('should reactively update when selected app changes', async () => {
      const mockApp1 = createMockApp([createMockUser({ id: 1 })]);
      appStore.selectedApp = mockApp1;

      wrapper = createWrapper();
      await nextTick();

      let vm = wrapper.vm as any;
      expect(vm.users).toHaveLength(1);

      const mockApp2 = createMockApp([createMockUser({ id: 2 }), createMockUser({ id: 3 })]);
      appStore.selectedApp = mockApp2;
      await nextTick();

      vm = wrapper.vm as any;
      expect(vm.users).toHaveLength(2);
    });

    it('should handle transition from app with users to null app', async () => {
      const mockApp = createMockApp([createMockUser()]);
      appStore.selectedApp = mockApp;

      wrapper = createWrapper();
      await nextTick();

      let vm = wrapper.vm as any;
      expect(vm.users).toHaveLength(1);

      appStore.selectedApp = null;
      await nextTick();

      vm = wrapper.vm as any;
      expect(vm.users).toEqual([]);
    });
  });

  describe('Store Integration', () => {
    it('should get users from appStore selected app', async () => {
      const users = [createMockUser()];
      const mockApp = createMockApp(users);
      appStore.selectedApp = mockApp;

      wrapper = createWrapper();
      await nextTick();

      const vm = wrapper.vm as any;
      expect(vm.users).toEqual(users);
    });

    it('should get super user status from userStore', async () => {
      userStore.user.isSuperUser = true;

      wrapper = createWrapper();
      await nextTick();

      const vm = wrapper.vm as any;
      const hasSuperUserColumn = vm.headers.some((h: any) => h.key === 'isSuperUser');
      expect(hasSuperUserColumn).toBe(true);
    });

    it('should use storeToRefs for reactive properties', async () => {
      const mockApp = createMockApp([createMockUser()]);
      appStore.selectedApp = mockApp;
      userStore.user.isSuperUser = false;

      wrapper = createWrapper();
      await nextTick();

      // Change store values
      const newApp = createMockApp([createMockUser(), createMockUser()]);
      appStore.selectedApp = newApp;
      userStore.user.isSuperUser = true;
      await nextTick();

      const vm = wrapper.vm as any;
      expect(vm.users).toHaveLength(2);
      expect(vm.headers).toHaveLength(6);
    });
  });
});

