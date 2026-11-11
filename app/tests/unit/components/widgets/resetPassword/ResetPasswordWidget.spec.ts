import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ResetPasswordWidget from '@/components/widgets/resetPassword/ResetPasswordWidget.vue';

describe('ResetPasswordWidget.vue', () => {
  it('defaults the token prop to an empty string', () => {
    const wrapper = mount(ResetPasswordWidget);

    expect(wrapper.props('token')).toBe('');
  });

  it('accepts a token prop', () => {
    const wrapper = mount(ResetPasswordWidget, {
      props: {
        token: 'password-reset-token',
      },
    });

    expect(wrapper.props('token')).toBe('password-reset-token');
  });
});