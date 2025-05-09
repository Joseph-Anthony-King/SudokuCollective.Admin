import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import SudokuView from '@/views/SudokuView.vue';
import SudokuPage from '@/components/pages/SudokuPage.vue';

// Mock the SudokuPage component
vi.mock('@/components/pages/SudokuPage.vue', () => ({
  default: {
    name: 'SudokuPage',
    render() {
      return h('div', { class: 'mocked-sudoku-page' });
    }
  }
}));

describe('SudokuView', () => {
  it('should render properly', () => {
    // Arrange & Act
    const wrapper = mount(SudokuView);
    
    // Assert
    expect(wrapper.exists()).toBe(true);
  });
  
  it('should render SudokuPage component', () => {
    // Arrange & Act
    const wrapper = mount(SudokuView);
    
    // Assert
    expect(wrapper.findComponent(SudokuPage).exists()).toBe(true);
  });
});
