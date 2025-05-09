import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import UserProfileView from '@/views/UserProfileView.vue';
import UserProfilePage from '@/components/pages/UserProfilePage.vue';

// Mock the UserProfilePage component
vi.mock('@/components/pages/UserProfilePage.vue', () => ({
  default: {
    name: 'UserProfilePage',
    render() {
      return h('div', { class: 'mocked-user-profile-page' });
    }
  }
}));

describe('UserProfileView', () => {
  it('should render properly', () => {
    // Arrange & Act
    const wrapper = mount(UserProfileView);
    
    // Assert
    expect(wrapper.exists()).toBe(true);
  });
  
  it('should render UserProfilePage component', () => {
    // Arrange & Act
    const wrapper = mount(UserProfileView);
    
    // Assert
    expect(wrapper.findComponent(UserProfilePage).exists()).toBe(true);
  });
});
