import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import HomePage from '@/components/pages/HomePage.vue';
import HeroWidget from '@/components/widgets/common/HeroWidget.vue';
import { useValueStore } from '@/stores/valueStore';

const vuetify = createVuetify({
  components,
  directives,
});

describe('HomePage.vue', () => {
  let pinia: ReturnType<typeof createPinia>;
  let valueStore: ReturnType<typeof useValueStore>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    valueStore = useValueStore(pinia);
  });

  const mountPage = () =>
    mount(HomePage, {
      global: {
        plugins: [pinia, vuetify],
      },
    });

  it('renders the hero, motto, and default empty mission statement', () => {
    const wrapper = mountPage();
    const hero = wrapper.getComponent(HeroWidget);

    expect(hero.props('headline')).toBe('Welcome to Sudoku Collective Admin Console');
    expect(wrapper.get('.motto').text()).toBe('Code, Create, Inspire...');
    expect(wrapper.get('.description').text()).toBe('');
  });

  it('renders and reacts to the mission statement from the value store', async () => {
    valueStore.missionStatement = '<strong>Build something great.</strong>';
    const wrapper = mountPage();

    expect(wrapper.get('.description').html()).toContain(
      '<strong>Build something great.</strong>',
    );

    valueStore.missionStatement = '<em>Inspire others.</em>';
    await wrapper.vm.$nextTick();

    expect(wrapper.get('.description').html()).toContain('<em>Inspire others.</em>');
  });
});