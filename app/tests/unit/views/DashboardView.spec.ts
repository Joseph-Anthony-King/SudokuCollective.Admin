import { h } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import DashboardView from '@/views/DashboardView.vue';
import DashboardPage from '@/components/pages/DashboardPage.vue';

// Mock the DashboardPage component
vi.mock('@/components/pages/DashboardPage.vue', () => ({
  default: {
    name: 'DashboardPage',
    render() {
      return h('div', { class: 'mocked-dashboard-page' });
    }
  }
}));

describe('The DashboardView vue view', () => {
  it('should render properly', () => {
    // Arrange & Act
    const wrapper = mount(DashboardView);
    
    // Assert
    expect(wrapper.exists()).toBe(true);
  });
  
  it('should render DashboardPage component', () => {
    // Arrange & Act
    const wrapper = mount(DashboardView);
    
    // Assert
    expect(wrapper.findComponent(DashboardPage).exists()).toBe(true);
  });
});
