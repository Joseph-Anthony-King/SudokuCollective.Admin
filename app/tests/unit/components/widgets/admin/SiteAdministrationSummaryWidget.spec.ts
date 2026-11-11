import { defineComponent, h, type PropType } from 'vue';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import SiteAdministrationSummaryWidget from '@/components/widgets/admin/SiteAdministrationSummaryWidget.vue';
import type { IAdminSummary } from '@/interfaces/infrastructure/iAdminSummary';
import { AdminSummary } from '@/models/infrastructure/adminSummary';
import { useAdminStore } from '@/stores/adminStore';

const DataTableStub = defineComponent({
  name: 'VDataTable',
  props: {
    items: {
      type: Array as PropType<IAdminSummary[]>,
      required: true,
    },
    headers: {
      type: Array as PropType<Array<{ title: string; key: keyof IAdminSummary; sortable?: boolean }>>,
      required: true,
    },
    itemsPerPage: {
      type: Number,
      default: undefined,
    },
    hideDefaultFooter: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    return () =>
      h('table', { 'data-testid': 'summary-table' }, [
        h('thead', [
          h('tr', props.headers.map((header) => h('th', header.title))),
        ]),
        h(
          'tbody',
          props.items.map((item) =>
            h(
              'tr',
              props.headers.map((header) => h('td', String(item[header.key]))),
            ),
          ),
        ),
      ]);
  },
});

const vuetify = createVuetify({
  components,
  directives,
});

describe('SiteAdministrationSummaryWidget.vue', () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  const mountWidget = () =>
    mount(SiteAdministrationSummaryWidget, {
      global: {
        plugins: [pinia, vuetify],
        stubs: {
          VDataTable: DataTableStub,
        },
      },
    });

  it('renders the summary heading and default metric values', () => {
    useAdminStore().updateAdminSummary(new AdminSummary());

    const wrapper = mountWidget();
    const table = wrapper.getComponent(DataTableStub);

    expect(wrapper.find('.headline').text()).toBe('Site Administration Summary');
    expect(table.props('itemsPerPage')).toBe(10);
    expect(table.props('hideDefaultFooter')).toBe(true);
    expect(table.props('headers').map((header: { title: string }) => header.title)).toEqual([
      'Apps',
      'Users',
      'Games',
      'Solutions',
      'Difficulties',
      'Roles',
      'Email Confirmations',
      'Password Resets',
    ]);
    expect(wrapper.get('[data-testid="summary-table"] tbody tr').text()).toBe('00000000');
  });

  it('renders counts from the admin summary store', () => {
    useAdminStore().updateAdminSummary(new AdminSummary(1, 2, 3, 4, 5, 6, 7, 8));

    const wrapper = mountWidget();

    expect(wrapper.get('[data-testid="summary-table"] tbody tr').text()).toBe(
      '18472635',
    );
    expect(wrapper.get('[data-testid="summary-table"] tbody tr').findAll('td').map((cell) =>
      cell.text(),
    )).toEqual(['1', '8', '4', '7', '2', '6', '3', '5']);
  });

  it('updates the table when the admin summary is replaced after mounting', async () => {
    const adminStore = useAdminStore();
    adminStore.updateAdminSummary(new AdminSummary());

    const wrapper = mountWidget();
    expect(wrapper.get('[data-testid="summary-table"] tbody tr').text()).toBe('00000000');

    adminStore.updateAdminSummary(new AdminSummary(10, 20, 30, 40, 50, 60, 70, 80));
    await wrapper.vm.$nextTick();

    expect(wrapper.get('[data-testid="summary-table"] tbody tr').findAll('td').map((cell) =>
      cell.text(),
    )).toEqual(['10', '80', '40', '70', '20', '60', '30', '50']);
  });
});