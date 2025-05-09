import { h } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import HomeView from '@/views/HomeView.vue';
import HomePage from '@/components/pages/HomePage.vue';

// Mock the HomePage component
vi.mock('@/components/pages/HomePage.vue', () => ({
  default: {
    name: 'HomePage',
    render() {
      return h('div', { class: 'mocked-home-page' });
    }
  }
}));

describe('The HomeView vue view', () => {
  it('should render properly', () => {
    // Arrange & Act
    const wrapper = mount(HomeView);
    
    // Assert
    expect(wrapper.exists()).toBe(true);
  });
  
  it('should render HomePage component', () => {
    // Arrange & Act
    const wrapper = mount(HomeView);
    
    // Assert
    expect(wrapper.findComponent(HomePage).exists()).toBe(true);
  });
});
