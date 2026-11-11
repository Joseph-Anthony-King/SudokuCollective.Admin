import { defineComponent, h, type PropType } from 'vue';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import AdminDropdownWidget from '@/components/widgets/admin/AdminDropdownWidget.vue';
import { useAdminStore } from '@/stores/adminStore';
import { AdminSummary } from '@/models/infrastructure/adminSummary';
import { Difficulty } from '@/models/domain/difficulty';
import { Role } from '@/models/domain/role';
import { DropdownItem } from '@/models/infrastructure/dropdownItem';

type Option = Record<string, unknown>;

const AutocompleteStub = defineComponent({
  name: 'VAutocomplete',
  props: {
    items: {
      type: Array as PropType<Option[]>,
      default: () => [],
    },
    itemTitle: {
      type: String,
      required: true,
    },
    itemValue: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    modelValue: {
      type: Number as PropType<number | null>,
      default: null,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h(
        'button',
        {
          'data-testid': `select-${props.label}`,
          onClick: () => emit('update:modelValue', 42),
        },
        props.label,
      );
  },
});

const vuetify = createVuetify({
  components,
  directives,
});

describe('AdminDropdownWidget.vue', () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  const mountWidget = () =>
    mount(AdminDropdownWidget, {
      global: {
        plugins: [pinia, vuetify],
        stubs: {
          VAutocomplete: AutocompleteStub,
        },
      },
    });

  it('initializes all dropdowns with empty store options and null selections', () => {
    const wrapper = mountWidget();
    const dropdowns = wrapper.findAllComponents(AutocompleteStub);

    expect(dropdowns).toHaveLength(5);
    expect(dropdowns.map((dropdown) => dropdown.props('label'))).toEqual([
      'Difficulty',
      'Role',
      'Release Environment',
      'Sort By',
      'Time Frame',
    ]);
    expect(dropdowns.map((dropdown) => dropdown.props('items'))).toEqual([
      [],
      [],
      [],
      [],
      [],
    ]);
    expect(dropdowns.map((dropdown) => dropdown.props('modelValue'))).toEqual([
      null,
      null,
      null,
      null,
      null,
    ]);
    expect(dropdowns.map((dropdown) => dropdown.props('itemTitle'))).toEqual([
      'displayName',
      'name',
      'label',
      'label',
      'label',
    ]);
    expect(dropdowns.map((dropdown) => dropdown.props('itemValue'))).toEqual([
      'id',
      'id',
      'value',
      'value',
      'value',
    ]);
  });

  it('shows store options, reacts to store updates, and binds each selected value', async () => {
    const adminStore = useAdminStore();
    const difficulties = [new Difficulty(1, 'Easy', 'Easy', 1)];
    const roles = [new Role(2, 'Admin', 1)];
    const releaseEnvironments = [new DropdownItem('Production', 4)];
    const sortValues = [new DropdownItem('Newest', 1)];
    const timeFrames = [new DropdownItem('Day', 3)];
    const summary = new AdminSummary(
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      difficulties,
      roles,
      releaseEnvironments,
      sortValues,
      timeFrames,
    );
    adminStore.updateAdminSummary(summary);

    const wrapper = mountWidget();
    const dropdowns = wrapper.findAllComponents(AutocompleteStub);

    expect(dropdowns.map((dropdown) => dropdown.props('items'))).toEqual([
      difficulties,
      roles,
      releaseEnvironments,
      sortValues,
      timeFrames,
    ]);

    await Promise.all(
      ['Difficulty', 'Role', 'Release Environment', 'Sort By', 'Time Frame'].map((label) =>
        wrapper.get(`[data-testid="select-${label}"]`).trigger('click'),
      ),
    );

    expect(wrapper.findAllComponents(AutocompleteStub).map((dropdown) => dropdown.props('modelValue')))
      .toEqual([42, 42, 42, 42, 42]);

    const updatedTimeFrames = [new DropdownItem('Week', 4)];
    adminStore.updateAdminSummary(
      new AdminSummary(
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        difficulties,
        roles,
        releaseEnvironments,
        sortValues,
        updatedTimeFrames,
      ),
    );
    await wrapper.vm.$nextTick();

    expect(wrapper.findAllComponents(AutocompleteStub)[4].props('items')).toEqual(updatedTimeFrames);
  });
});