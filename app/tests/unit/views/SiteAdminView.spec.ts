import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import SiteAdminView from '@/views/SiteAdminView.vue';
import SiteAdminPage from '@/components/pages/SiteAdminPage.vue';

// Mock the SiteAdminPage component
vi.mock('@/components/pages/SiteAdminPage.vue', () => ({
  default: {
    name: 'SiteAdminPage',
    render() {
      return h('div', { class: 'mocked-site-admin-page' });
    }
  }
}));

describe('SiteAdminView', () => {
  it('should render properly', () => {
    // Arrange & Act
    const wrapper = mount(SiteAdminView);
    
    // Assert
    expect(wrapper.exists()).toBe(true);
  });
  
  it('should render SiteAdminPage component', () => {
    // Arrange & Act
    const wrapper = mount(SiteAdminView);
    
    // Assert
    expect(wrapper.findComponent(SiteAdminPage).exists()).toBe(true);
  });
});
