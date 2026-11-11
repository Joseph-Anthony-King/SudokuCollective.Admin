import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ConfirmEmailPage from '@/components/pages/ConfirmEmailPage.vue';

const ConfirmEmailWidgetStub = defineComponent({
  name: 'ConfirmEmailWidget',
  props: {
    token: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    return () => h('div', { 'data-testid': 'confirm-email-widget', 'data-token': props.token });
  },
});

describe('ConfirmEmailPage.vue', () => {
  const mountPage = (token?: string) =>
    mount(ConfirmEmailPage, {
      props: token === undefined ? {} : { token },
      global: {
        stubs: {
          ConfirmEmailWidget: ConfirmEmailWidgetStub,
        },
      },
    });

  it('passes the default empty token to the widget', () => {
    const wrapper = mountPage();

    expect(wrapper.getComponent(ConfirmEmailWidgetStub).props('token')).toBe('');
    expect(wrapper.get('[data-testid="confirm-email-widget"]').attributes('data-token')).toBe('');
  });

  it('passes the provided token to the widget', () => {
    const wrapper = mountPage('confirmation-token');

    expect(wrapper.getComponent(ConfirmEmailWidgetStub).props('token')).toBe(
      'confirmation-token',
    );
    expect(wrapper.get('[data-testid="confirm-email-widget"]').attributes('data-token')).toBe(
      'confirmation-token',
    );
  });
});