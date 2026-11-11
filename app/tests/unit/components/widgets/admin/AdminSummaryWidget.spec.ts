import { defineComponent, h, type PropType } from 'vue';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import AdminSummaryWidget from '@/components/widgets/admin/AdminSummaryWidget.vue';
import { AdminSummary } from '@/models/infrastructure/adminSummary';
import { useAdminStore } from '@/stores/adminStore';

const GaugeWidgetStub = defineComponent({
  name: 'GaugeWidget',
  props: {
    labelProp: {
      type: String,
      required: true,
    },
    valueProp: {
      type: Number as PropType<number>,
      required: true,
    },
  },
  setup(props) {
    return () =>
      h(
        'div',
        { class: 'gauge-widget', 'data-testid': 'gauge' },
        `${props.labelProp}: ${props.valueProp}`,
      );
  },
});

const SiteAdministrationSummaryWidgetStub = defineComponent({
  name: 'SiteAdministrationSummaryWidget',
  setup() {
    return () => h('div', { 'data-testid': 'site-administration-summary' });
  },
});

const vuetify = createVuetify({
  components,
  directives,
});

describe('AdminSummaryWidget.vue', () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  const mountWidget = () =>
    mount(AdminSummaryWidget, {
      global: {
        plugins: [pinia, vuetify],
        stubs: {
          GaugeWidget: GaugeWidgetStub,
          SiteAdministrationSummaryWidget: SiteAdministrationSummaryWidgetStub,
        },
      },
    });

  it('renders all summary metrics and the site administration summary', () => {
    const summary = new AdminSummary(1, 2, 3, 4, 5, 6, 7, 8);
    useAdminStore().updateAdminSummary(summary);

    const wrapper = mountWidget();

    expect(wrapper.find('.gauge-rows').exists()).toBe(true);
    expect(wrapper.findAll('[data-testid="gauge"]').map((gauge) => gauge.text())).toEqual([
      'Apps: 1',
      'Users: 8',
      'Games: 4',
      'Solutions: 7',
      'Difficulties: 2',
      'Roles: 6',
      'Email Confirmations: 3',
      'Password Resets: 5',
    ]);
    expect(wrapper.find('[data-testid="site-administration-summary"]').exists()).toBe(true);
  });

  it('reacts when the admin summary is replaced in the store', async () => {
    const adminStore = useAdminStore();
    adminStore.updateAdminSummary(new AdminSummary());

    const wrapper = mountWidget();
    expect(wrapper.findAll('[data-testid="gauge"]')[0].text()).toBe('Apps: 0');

    adminStore.updateAdminSummary(new AdminSummary(12, 0, 0, 0, 0, 0, 0, 0));
    await wrapper.vm.$nextTick();

    expect(wrapper.findAll('[data-testid="gauge"]')[0].text()).toBe('Apps: 12');
  });
});