import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import ResetPasswordView from '@/views/ResetPasswordView.vue';
import ResetPasswordPage from '@/components/pages/ResetPasswordPage.vue';

// Mock the ResetPasswordPage component
vi.mock('@/components/pages/ResetPasswordPage.vue', () => ({
  default: {
    name: 'ResetPasswordPage',
    props: ['token'],
    render() {
      return h('div', { class: 'mocked-reset-password-page' });
    }
  }
}));

describe('The ResetPasswordView vue view', () => {
  it('should render properly', () => {
    // Arrange & Act
    const wrapper = mount(ResetPasswordView, {
      props: {
        token: 'test-token'
      }
    });
    
    // Assert
    expect(wrapper.exists()).toBe(true);
  });
  
  it('should render ResetPasswordPage component', () => {
    // Arrange & Act
    const wrapper = mount(ResetPasswordView, {
      props: {
        token: 'test-token'
      }
    });
    
    // Assert
    expect(wrapper.findComponent(ResetPasswordPage).exists()).toBe(true);
  });

  it('should pass token prop to ResetPasswordPage', () => {
    // Arrange
    const testToken = 'reset-token-123';
    
    // Act
    const wrapper = mount(ResetPasswordView, {
      props: {
        token: testToken
      }
    });
    
    // Assert
    expect(wrapper.findComponent(ResetPasswordPage).props('token')).toBe(testToken);
  });

  it('should use default token value when not provided', () => {
    // Arrange & Act
    const wrapper = mount(ResetPasswordView);
    
    // Assert
    expect(wrapper.findComponent(ResetPasswordPage).props('token')).toBe('');
  });
});
