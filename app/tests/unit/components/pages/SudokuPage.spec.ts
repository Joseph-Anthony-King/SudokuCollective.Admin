import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import SudokuPage from '@/components/pages/SudokuPage.vue';

const SudokuWidgetStub = defineComponent({
  name: 'SudokuWidget',
  setup() {
    return () => h('div', { 'data-testid': 'sudoku-widget' }, 'Sudoku game');
  },
});

describe('SudokuPage.vue', () => {
  it('renders the Sudoku widget', () => {
    const wrapper = mount(SudokuPage, {
      global: {
        stubs: {
          SudokuWidget: SudokuWidgetStub,
        },
      },
    });

    expect(wrapper.get('[data-testid="sudoku-widget"]').text()).toBe('Sudoku game');
  });
});