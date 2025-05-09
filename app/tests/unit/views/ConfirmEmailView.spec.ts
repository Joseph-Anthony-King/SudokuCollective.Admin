import { h } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ConfirmEmailView from '@/views/ConfirmEmailView.vue';
import ConfirmEmailPage from '@/components/pages/ConfirmEmailPage.vue';

// Mock the ConfirmEmailPage component
vi.mock('@/components/pages/ConfirmEmailPage.vue', () => ({
  default: {
    name: 'ConfirmEmailPage',
    props: ['token'],
    render() {
      return h('div', { class: 'mocked-confirm-email-page' });
    }
  }
}));

describe('The ConfirmEmailView vue view', () => {
  it('should render properly', () => {
    // Arrange & Act
    const wrapper = mount(ConfirmEmailView, {
      props: {
        token: 'test-token'
      }
    });
    
    // Assert
    expect(wrapper.exists()).toBe(true);
  });
  
  it('should render ConfirmEmailPage component', () => {
    // Arrange & Act
    const wrapper = mount(ConfirmEmailView, {
      props: {
        token: 'test-token'
      }
    });
    
    // Assert
    expect(wrapper.findComponent(ConfirmEmailPage).exists()).toBe(true);
  });

  it('should pass token prop to ConfirmEmailPage', () => {
    // Arrange
    const testToken = 'test-token-123';
    
    // Act
    const wrapper = mount(ConfirmEmailView, {
      props: {
        token: testToken
      }
    });
    
    // Assert
    expect(wrapper.findComponent(ConfirmEmailPage).props('token')).toBe(testToken);
  });

  it('should use default token value when not provided', () => {
    // Arrange & Act
    const wrapper = mount(ConfirmEmailView);
    
    // Assert
    expect(wrapper.findComponent(ConfirmEmailPage).props('token')).toBe('');
  });
});
