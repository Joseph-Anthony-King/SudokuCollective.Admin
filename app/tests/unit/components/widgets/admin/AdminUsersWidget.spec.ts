import { defineComponent, h, type PropType } from 'vue';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import AdminUsersWidget from '@/components/widgets/admin/AdminUsersWidget.vue';
import type { IUser } from '@/interfaces/domain/iUser';
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
});