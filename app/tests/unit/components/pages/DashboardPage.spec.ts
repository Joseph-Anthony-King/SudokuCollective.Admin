import { defineComponent, h, onMounted } from 'vue';
import { mount, flushPromises } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import DashboardPage from '@/components/pages/DashboardPage.vue';
import { useAppStore } from '@/stores/appStore';
import { useUserStore } from '@/stores/userStore';
import { App } from '@/models/domain/app';
import { User } from '@/models/domain/user';
import { StoreType } from '@/enums/storeTypes';
import type { ICreateAppLicenseRequestData } from '@/interfaces/requests/iCreateAppLicenseRequestData';

const utilities = vi.hoisted(() => ({
  displaySuccessfulToast: vi.fn(),
  displayFailedToastAsync: vi.fn(),
  updateAppProcessingAsync: vi.fn(),
}));

vi.mock('@/utilities/common', () => ({
  default: () => utilities,
}));

const AppRolodexStub = defineComponent({
  name: 'AppRolodex',
  emits: ['show-create-app', 'close-app-view'],
  setup(_, { emit }) {
    return () =>
      h(
        'button',
        {
          'data-testid': 'show-create-app',
          onClick: () => emit('show-create-app'),
        },
        'Create app',
      );
  },
});

const CreateAppFormStub = defineComponent({
  name: 'CreateAppForm',
  emits: ['created', 'cancel'],
  setup(_, { emit }) {
    const data: ICreateAppLicenseRequestData = { name: 'New app', ownerId: 1 };
    return () =>
      h('div', { 'data-testid': 'create-app-form' }, [
        h('button', { 'data-testid': 'created', onClick: () => emit('created', data) }, 'Created'),
        h('button', { 'data-testid': 'cancel', onClick: () => emit('cancel') }, 'Cancel'),
      ]);
  },
});

const SelectedAppFormStub = defineComponent({
  name: 'SelectedAppForm',
  setup() {
    return () => h('div', { 'data-testid': 'selected-app-form' });
  },
});

const SelectedAppUsersFormStub = defineComponent({
  name: 'SelectedAppUsersForm',
  props: {
    displayRegistered: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    return () =>
      h('div', {
        'data-testid': props.displayRegistered ? 'registered-users' : 'non-registered-users',
      });
  },
});

const ModelComponentStub = defineComponent({
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    onMounted(() => emit('update:modelValue', props.modelValue));

    return () => h('div', slots.default?.());
  },
});

describe('DashboardPage.vue', () => {
  let pinia: ReturnType<typeof createPinia>;
  let appStore: ReturnType<typeof useAppStore>;
  let userStore: ReturnType<typeof useUserStore>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    appStore = useAppStore(pinia);
    userStore = useUserStore(pinia);

    utilities.displaySuccessfulToast.mockReset();
    utilities.displayFailedToastAsync.mockReset().mockResolvedValue(undefined);
    utilities.updateAppProcessingAsync.mockReset().mockImplementation(async (callback) => {
      await callback();
    });

    userStore.updateUser(new User());
    appStore.selectedApp = null;
    appStore.postCreateAppLicenseAsync = vi.fn();
  });

  const mountPage = (props: { action?: string } = {}) =>
    mount(DashboardPage, {
      props,
      global: {
        plugins: [pinia],
        stubs: {
          AppRolodex: AppRolodexStub,
          CreateAppForm: CreateAppFormStub,
          SelectedAppForm: SelectedAppFormStub,
          SelectedAppUsersForm: SelectedAppUsersFormStub,
          VContainer: { template: '<div><slot /></div>' },
          VCard: { template: '<section><slot /></section>' },
          VCardText: { template: '<div><slot /></div>' },
          VCardTitle: { template: '<h1><slot /></h1>' },
          VRow: { template: '<div><slot /></div>' },
          VCol: { template: '<div><slot /></div>' },
          VTabs: ModelComponentStub,
          VTab: { template: '<button><slot /></button>' },
          VIcon: { template: '<span><slot /></span>' },
          VWindow: ModelComponentStub,
          VWindowItem: { template: '<div><slot /></div>' },
        },
      },
    });

  it('renders the dashboard with no selected app', () => {
    const wrapper = mountPage();

    expect(wrapper.text()).toContain('Dashboard');
    expect(wrapper.get('[data-testid="show-create-app"]').text()).toBe('Create app');
    expect(wrapper.find('#app-create').exists()).toBe(false);
    expect(wrapper.find('#app-details').exists()).toBe(false);
  });

  it('shows and hides the create-app form from child events', async () => {
    const wrapper = mountPage();

    await wrapper.get('[data-testid="show-create-app"]').trigger('click');
    expect(wrapper.find('#app-create').exists()).toBe(true);
    expect(wrapper.find('#app-details').exists()).toBe(false);

    await wrapper.get('[data-testid="cancel"]').trigger('click');
    expect(wrapper.find('#app-create').exists()).toBe(false);
  });

  it('shows selected-app details and both user lists when an app is selected', async () => {
    appStore.selectedApp = new App();
    const wrapper = mountPage();
    await flushPromises();

    expect(wrapper.find('#app-details').exists()).toBe(true);
    expect(wrapper.get('[data-testid="selected-app-form"]').attributes('data-testid')).toBe(
      'selected-app-form',
    );
    expect(wrapper.get('[data-testid="registered-users"]').attributes('data-testid')).toBe(
      'registered-users',
    );
    expect(wrapper.get('[data-testid="non-registered-users"]').attributes('data-testid')).toBe(
      'non-registered-users',
    );
    expect(wrapper.getComponent(SelectedAppUsersFormStub).props('displayRegistered')).toBe(true);
    expect(wrapper.findAllComponents(SelectedAppUsersFormStub)[1].props('displayRegistered')).toBe(
      false,
    );
  });

  it('clears the selection and closes app details when the rolodex emits close-app-view', async () => {
    appStore.selectedApp = new App();
    const setSelectedApp = vi.spyOn(appStore, 'setSelectedAppAsync');
    const wrapper = mountPage();

    expect(wrapper.find('#app-details').exists()).toBe(true);
    wrapper.getComponent(AppRolodexStub).vm.$emit('close-app-view');
    await flushPromises();

    expect(setSelectedApp).toHaveBeenCalledOnce();
    expect(setSelectedApp).toHaveBeenCalledWith();
    expect(appStore.selectedApp).toBeNull();
    expect(wrapper.find('#app-details').exists()).toBe(false);
  });

  it('processes successful app creation and shows the success toast', async () => {
    appStore.postCreateAppLicenseAsync = vi.fn().mockResolvedValue(true);
    const wrapper = mountPage();

    await wrapper.get('[data-testid="show-create-app"]').trigger('click');
    await wrapper.get('[data-testid="created"]').trigger('click');
    await flushPromises();

    expect(appStore.postCreateAppLicenseAsync).toHaveBeenCalledWith({
      name: 'New app',
      ownerId: 1,
    });
    expect(utilities.updateAppProcessingAsync).toHaveBeenCalledOnce();
    expect(utilities.displaySuccessfulToast).toHaveBeenCalledWith(StoreType.APPSTORE);
    expect(utilities.displayFailedToastAsync).not.toHaveBeenCalled();
    expect(wrapper.find('#app-create').exists()).toBe(false);
  });

  it('processes failed app creation and shows the failure toast', async () => {
    appStore.postCreateAppLicenseAsync = vi.fn().mockResolvedValue(false);
    const wrapper = mountPage();

    await wrapper.get('[data-testid="show-create-app"]').trigger('click');
    await wrapper.get('[data-testid="created"]').trigger('click');
    await flushPromises();

    expect(utilities.displayFailedToastAsync).toHaveBeenCalledWith(undefined, undefined);
    expect(utilities.displaySuccessfulToast).not.toHaveBeenCalled();
    expect(wrapper.find('#app-create').exists()).toBe(false);
  });

  it('marks the user as logging in when the action is login, ignoring case', () => {
    const user = new User();
    userStore.updateUser(user);
    const updateUserSpy = vi.spyOn(userStore, 'updateUser');

    mountPage({ action: 'LoGiN' });

    expect(user.isLoggingIn).toBe(true);
    expect(updateUserSpy).toHaveBeenCalledWith(user);
  });

  it('does not alter the user for other actions', () => {
    const user = new User();
    user.isLoggingIn = false;
    userStore.updateUser(user);
    const updateUserSpy = vi.spyOn(userStore, 'updateUser');

    mountPage({ action: 'dashboard' });

    expect(user.isLoggingIn).toBe(false);
    expect(updateUserSpy).not.toHaveBeenCalled();
  });
});