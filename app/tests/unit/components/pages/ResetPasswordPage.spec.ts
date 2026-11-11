import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ResetPasswordPage from '@/components/pages/ResetPasswordPage.vue';

const ResetPasswordWidgetStub = defineComponent({
  name: 'ResetPasswordWidget',
  props: {
    token: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    return () => h('div', { 'data-testid': 'reset-password-widget', 'data-token': props.token });
  },
});

describe('ResetPasswordPage.vue', () => {
  const mountPage = (token?: string) =>
    mount(ResetPasswordPage, {
      props: token === undefined ? {} : { token },
      global: {
        stubs: {
          ResetPasswordWidget: ResetPasswordWidgetStub,
        },
      },
    });

  it('passes the default empty token to the widget', () => {
    const wrapper = mountPage();

    expect(wrapper.getComponent(ResetPasswordWidgetStub).props('token')).toBe('');
    expect(wrapper.get('[data-testid="reset-password-widget"]').attributes('data-token')).toBe('');
  });

  it('passes a supplied token to the widget', () => {
    const wrapper = mountPage('reset-password-token');

    expect(wrapper.getComponent(ResetPasswordWidgetStub).props('token')).toBe(
      'reset-password-token',
    );
    expect(wrapper.get('[data-testid="reset-password-widget"]').attributes('data-token')).toBe(
      'reset-password-token',
    );
  });
});