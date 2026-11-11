import { defineComponent, h, type PropType } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AxiosResponse } from 'axios';
import { createPinia, setActivePinia } from 'pinia';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import AdminUsersWidget from '@/components/widgets/admin/AdminUsersWidget.vue';
import type { IUser } from '@/interfaces/domain/iUser';
import { UsersPort } from '@/ports/usersPort';
import { useAdminStore } from '@/stores/adminStore';

const { formatDateCreated } = vi.hoisted(() => ({
  formatDateCreated: vi.fn((date: Date | null) => (date ? 'formatted date' : 'N/A')),
}));

vi.mock('@/utilities/common', () => ({
  default: () => ({ formatDateCreated }),
}));

const DataTableStub = defineComponent({
  name: 'VDataTable',
  props: {
    items: {
      type: Array as PropType<IUser[]>,
      default: () => [],
    },
    headers: {
      type: Array as PropType<Array<{ title: string; key: string }>>,
      default: () => [],
    },
  },
  setup(props, { slots }) {
    return () =>
      h(
        'div',
        { 'data-testid': 'data-table' },
        props.items.flatMap((item, index) => [
          h('div', { key: `row-${index}`, 'data-testid': `row-${index}` }, [
            slots['item.isActive']?.({ item }),
            slots['item.dateCreated']?.({ item }),
            slots['item.actions']?.({ item }),
          ]),
          ...(slots['expanded-row']?.({ item }) ?? []),
        ]),
      );
  },
});

const vuetify = createVuetify({
  components,
  directives,
});

const makeUser = (overrides: Partial<IUser> = {}): IUser => ({
  id: 1,
  userName: 'user',
  firstName: 'First',
  lastName: 'Last',
  nickName: 'Nick',
  fullName: 'First Last',
  email: 'user@example.com',
  isEmailConfirmed: true,
  receivedRequestToUpdateEmail: false,
  receivedRequestToUpdatePassword: false,
  isActive: true,
  isSuperUser: false,
  isAdmin: false,
  dateCreated: new Date('2024-01-02T03:04:00'),
  dateUpdated: new Date('2024-02-03T04:05:00'),
  isLoggedIn: false,
  isLoggingIn: false,
  isObtainingAssistance: false,
  isSignedUp: true,
  isSigningUp: false,
  isEditing: false,
  ...overrides,
});

describe('AdminUsersWidget.vue', () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    formatDateCreated.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mountWidget = (users: IUser[]) => {
    useAdminStore().updateUsers(users);

    return mount(AdminUsersWidget, {
      global: {
        plugins: [pinia, vuetify],
        stubs: {
          VDataTable: DataTableStub,
        },
      },
    });
  };

  it('renders users, action states, and expanded profile details', () => {
    const users = [
      makeUser(),
      makeUser({
        id: 2,
        fullName: null,
        nickName: null,
        email: null,
        isEmailConfirmed: false,
        isActive: false,
        dateCreated: null,
        dateUpdated: null,
      }),
    ];

    const wrapper = mountWidget(users);

    expect(wrapper.find('.headline').text()).toBe('Site Users');
    expect(wrapper.findAll('[data-testid^="row-"]')).toHaveLength(2);
    expect(wrapper.get('[data-testid="row-0"]').get('.v-chip').text()).toBe('Active');
    expect(wrapper.get('[data-testid="row-1"]').get('.v-chip').text()).toBe('Inactive');
    expect(wrapper.text()).toContain('formatted date');
    expect(wrapper.find('[title="Deactivate User"]').exists()).toBe(true);
    expect(wrapper.find('[title="Activate User"]').exists()).toBe(true);

    const expandedRows = wrapper.findAll('tr');
    expect(expandedRows).toHaveLength(2);
    expect(expandedRows[0].text()).toContain('Full Name: First Last');
    expect(expandedRows[0].text()).toContain('Nickname: Nick');
    expect(expandedRows[0].text()).toContain('Email: user@example.com');
    expect(expandedRows[0].text()).toContain('Email Confirmed: Yes');
    expect(expandedRows[0].text()).toContain('Date Created: formatted date');
    expect(expandedRows[0].text()).toContain('Date Updated: formatted date');
    expect(expandedRows[1].text()).toContain('Full Name: N/A');
    expect(expandedRows[1].text()).toContain('Nickname: N/A');
    expect(expandedRows[1].text()).toContain('Email: N/A');
    expect(expandedRows[1].text()).toContain('Email Confirmed: No');
    expect(expandedRows[1].text()).toContain('Date Created: N/A');
    expect(expandedRows[1].text()).toContain('Date Updated: N/A');
    expect(formatDateCreated).toHaveBeenCalled();
  });

  it('renders an empty data table when there are no users', () => {
    const wrapper = mountWidget([]);

    expect(wrapper.find('[data-testid="data-table"]').exists()).toBe(true);
    expect(wrapper.findAll('[data-testid^="row-"]')).toHaveLength(0);
    expect(wrapper.findAll('tr')).toHaveLength(0);
  });

  it('calls the correct store action when each user button is clicked', async () => {
    const wrapper = mountWidget([
      makeUser({ id: 12, isActive: true }),
      makeUser({ id: 34, isActive: false }),
    ]);
    const adminStore = useAdminStore();
    const activate = vi.spyOn(adminStore, 'putActivateUserAsync').mockResolvedValue(true);
    const deactivate = vi.spyOn(adminStore, 'putDeactivateUserAsync').mockResolvedValue(true);
    const activeRow = wrapper.get('[data-testid="row-0"]');
    const inactiveRow = wrapper.get('[data-testid="row-1"]');

    expect(activeRow.find('[title="Activate User"]').exists()).toBe(false);
    expect(inactiveRow.find('[title="Deactivate User"]').exists()).toBe(false);

    await activeRow.get('[title="Deactivate User"]').trigger('click');
    expect(deactivate).toHaveBeenCalledOnce();
    expect(deactivate).toHaveBeenCalledWith(12);
    expect(activate).not.toHaveBeenCalled();

    await inactiveRow.get('[title="Activate User"]').trigger('click');
    expect(activate).toHaveBeenCalledOnce();
    expect(activate).toHaveBeenCalledWith(34);
    expect(deactivate).toHaveBeenCalledOnce();
  });

  it('updates the real table after successful actions and leaves it unchanged on failure', async () => {
    const activeUser = makeUser({ id: 12, isActive: true });
    const otherUser = makeUser({ id: 34, isActive: true });
    const store = useAdminStore();
    store.updateUsers([activeUser, otherUser]);
    const deactivate = vi.spyOn(UsersPort, 'putDeactivateUserAsync').mockResolvedValue({
      data: { isSuccess: true, message: 'User deactivated.', payload: [] },
    } as AxiosResponse);
    const activate = vi.spyOn(UsersPort, 'putActivateUserAsync')
      .mockResolvedValueOnce({
        status: 400,
        data: { isSuccess: false, message: 'Activation failed.', payload: [] },
      } as AxiosResponse)
      .mockResolvedValueOnce({
        data: {
          isSuccess: true,
          message: 'User activated.',
          payload: [{ ...activeUser, isActive: false }],
        },
      } as AxiosResponse);
    const wrapper = mount(AdminUsersWidget, {
      global: { plugins: [pinia, vuetify], stubs: { VDataTableFooter: true } },
    });

    expect(wrapper.findAll('[title="Deactivate User"]')).toHaveLength(2);
    await wrapper.findAll('[title="Deactivate User"]')[0].trigger('click');
    await flushPromises();
    expect(deactivate).toHaveBeenCalledWith(12, null);
    expect(store.users.map((user) => user.isActive)).toEqual([false, true]);
    expect(wrapper.findAll('[title="Activate User"]')).toHaveLength(1);
    expect(wrapper.findAll('[title="Deactivate User"]')).toHaveLength(1);

    await wrapper.get('[title="Activate User"]').trigger('click');
    await flushPromises();
    expect(store.users[0].isActive).toBe(false);
    expect(wrapper.findAll('[title="Activate User"]')).toHaveLength(1);

    await wrapper.get('[title="Activate User"]').trigger('click');
    await flushPromises();
    expect(activate).toHaveBeenCalledWith(12, null);
    expect(store.users.map((user) => user.isActive)).toEqual([true, true]);
    expect(wrapper.findAll('[title="Activate User"]')).toHaveLength(0);
    expect(wrapper.findAll('[title="Deactivate User"]')).toHaveLength(2);
  });
});