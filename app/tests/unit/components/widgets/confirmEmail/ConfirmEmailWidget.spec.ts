import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ConfirmEmailWidget from '@/components/widgets/confirmEmail/ConfirmEmailWidget.vue';

describe('ConfirmEmailWidget.vue', () => {
  it('defaults the token prop to an empty string', () => {
    const wrapper = mount(ConfirmEmailWidget);

    expect(wrapper.props('token')).toBe('');
  });

  it('accepts a token prop', () => {
    const wrapper = mount(ConfirmEmailWidget, {
      props: {
        token: 'email-confirmation-token',
      },
    });

    expect(wrapper.props('token')).toBe('email-confirmation-token');
  });
});