import { defineComponent, h, type PropType } from 'vue';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import AdminAppsWidget from '@/components/widgets/admin/AdminAppsWidget.vue';
import type { IApp } from '@/interfaces/domain/iApp';
import { ReleaseEnvironment } from '@/enums/releaseEnvironment';
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
      type: Array as PropType<IApp[]>,
      default: () => [],
    },
  },
  setup(props, { slots }) {
    return () =>
      h(
        'div',
        { 'data-testid': 'data-table' },
        props.items.flatMap((item, index) => [
          h(
            'div',
            { key: `row-${index}`, 'data-testid': `row-${index}` },
            [
              slots['item.isActive']?.({ item }),
              slots['item.environment']?.({ item }),
              slots['item.dateCreated']?.({ item }),
              slots['item.actions']?.({ item }),
            ].flat(),
          ),
          ...(slots['expanded-row']?.({ item }) ?? []),
        ]),
      );
  },
});

const vuetify = createVuetify({
  components,
  directives,
});

const makeApp = (overrides: Partial<IApp> = {}): IApp => ({
  id: 1,
  name: 'Example App',
  license: null,
  ownerId: 7,
  localUrl: 'https://local.example.com',
  testUrl: 'https://test.example.com',
  stagingUrl: 'https://staging.example.com',
  prodUrl: 'https://prod.example.com',
  sourceCodeUrl: null,
  isActive: true,
  environment: ReleaseEnvironment.LOCAL,
  permitSuperUserAccess: false,
  permitCollectiveLogins: false,
  disableCustomUrls: false,
  customEmailConfirmationAction: null,
  customPasswordResetAction: null,
  useCustomSMTPServer: false,
  smtpServerSettings: null,
  timeFrame: null,
  accessDuration: null,
  displayInGallery: false,
  dateCreated: new Date('2024-01-02T03:04:00'),
  dateUpdated: new Date('2024-02-03T04:05:00'),
  users: [],
  isEditing: false,
  ...overrides,
  get userCount() {
    return this.users?.length ?? null;
  },
});

describe('AdminAppsWidget.vue', () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    formatDateCreated.mockClear();
  });

  const mountWidget = (apps: IApp[]) => {
    useAdminStore().updateApps(apps);

    return mount(AdminAppsWidget, {
      global: {
        plugins: [pinia, vuetify],
        stubs: {
          VDataTable: DataTableStub,
        },
      },
    });
  };

  it('renders app rows and all environment-specific and conditional content', () => {
    const apps = [
      makeApp(),
      makeApp({
        id: 2,
        name: 'Test App',
        isActive: false,
        environment: ReleaseEnvironment.TEST,
      }),
      makeApp({
        id: 3,
        name: null,
        ownerId: null,
        environment: ReleaseEnvironment.STAGING,
        dateCreated: null,
        dateUpdated: null,
      }),
      makeApp({
        id: 4,
        environment: ReleaseEnvironment.PROD,
      }),
      makeApp({
        id: 5,
        name: null,
        environment: null,
        localUrl: null,
        testUrl: null,
        stagingUrl: null,
        prodUrl: null,
      }),
    ];

    const wrapper = mountWidget(apps);

    expect(wrapper.find('.headline').text()).toBe('Site Apps');
    expect(wrapper.findAll('[data-testid^="row-"]')).toHaveLength(apps.length);
    expect(wrapper.text()).toContain('Active');
    expect(wrapper.text()).toContain('Inactive');
    expect(wrapper.text()).toContain('https://local.example.com');
    expect(wrapper.text()).toContain('https://test.example.com');
    expect(wrapper.text()).toContain('https://staging.example.com');
    expect(wrapper.text()).toContain('https://prod.example.com');
    expect(wrapper.text()).toContain('N/A');
    expect(wrapper.text()).toContain('Development');
    expect(wrapper.text()).toContain('Testing');
    expect(wrapper.text()).toContain('Staging');
    expect(wrapper.text()).toContain('Production');

    expect(wrapper.find('[aria-label="Open Example App URL in a new tab"]').attributes('href'))
      .toBe('https://local.example.com');
    expect(wrapper.find('button[disabled]').exists()).toBe(true);
    expect(wrapper.find('[title="Deactivate App"]').exists()).toBe(true);
    expect(wrapper.find('[title="Activate App"]').exists()).toBe(true);

    const expandedRows = wrapper.findAll('tr');
    expect(expandedRows).toHaveLength(apps.length);
    expect(expandedRows[2].text()).toContain('Name: N/A');
    expect(expandedRows[2].text()).toContain('Owner: N/A');
    expect(expandedRows[2].text()).toContain('Date Created: N/A');
    expect(expandedRows[2].text()).toContain('Date Updated: N/A');
    expect(expandedRows[0].text()).toContain('formatted date');
    expect(formatDateCreated).toHaveBeenCalled();
  });

  it('renders an empty table when there are no apps', () => {
    const wrapper = mountWidget([]);

    expect(wrapper.find('[data-testid="data-table"]').exists()).toBe(true);
    expect(wrapper.findAll('[data-testid^="row-"]')).toHaveLength(0);
    expect(wrapper.findAll('tr')).toHaveLength(0);
  });
});