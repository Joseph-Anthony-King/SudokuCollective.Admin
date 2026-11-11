import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { beforeEach, describe, expect, it } from 'vitest';
import ConfirmEmailResultWidget from '@/components/widgets/confirmEmail/ConfirmEmailResultWidget.vue';
import { EmailConfirmationType } from '@/enums/emailConfirmationType';
import { useConfirmEmailStore } from '@/stores/confirmEmailStore';

const vuetify = createVuetify({
  components,
  directives,
});

describe('ConfirmEmailResultWidget.vue', () => {
  let pinia: ReturnType<typeof createPinia>;
  let confirmEmailStore: ReturnType<typeof useConfirmEmailStore>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    confirmEmailStore = useConfirmEmailStore(pinia);
    confirmEmailStore.initializeStore();
  });

  const mountWidget = () =>
    mount(ConfirmEmailResultWidget, {
      global: {
        plugins: [pinia, vuetify],
      },
    });

  it('renders the new-profile success message', () => {
    confirmEmailStore.updateIsSuccess(true);
    confirmEmailStore.updateConfirmationType(EmailConfirmationType.NEWPROFILECONFIRMED);
    confirmEmailStore.updateUserName('new-user');

    const wrapper = mountWidget();

    expect(wrapper.find('.headline').text()).toBe('Email Confirmed');
    expect(wrapper.text()).toContain(
      'Thank you for confirming your email address new-user, your profile has been updated.',
    );
    expect(wrapper.text()).toContain('Hope you are having fun!');
  });

  it('renders the old-email success message and the new address', () => {
    confirmEmailStore.updateIsSuccess(true);
    confirmEmailStore.updateConfirmationType(EmailConfirmationType.OLDEMAILCONFIRMED);
    confirmEmailStore.updateUserName('existing-user');
    confirmEmailStore.updateEmail('new@example.com');

    const wrapper = mountWidget();

    expect(wrapper.find('.headline').text()).toBe('Old Email Confirmed');
    expect(wrapper.text()).toContain('Thank you for confirming your old email address existing-user');
    expect(wrapper.find('.primary-color').text()).toBe('new@example.com');
    expect(wrapper.text()).toContain('sudokucollective@gmail.com');
    expect(wrapper.text()).toContain('within 24 hours');
  });

  it('renders the error message and new-email title', () => {
    confirmEmailStore.updateIsSuccess(false);
    confirmEmailStore.updateConfirmationType(EmailConfirmationType.NEWEMAILCONFIRMED);
    confirmEmailStore.updateUserName('existing-user');

    const wrapper = mountWidget();

    expect(wrapper.find('.headline').text()).toBe('New Email Confirmed');
    expect(wrapper.text()).toContain(
      'There was an error confirming your email address existing-user and your request could not be completed.',
    );
  });

  it('uses the fallback title for an unknown confirmation type', () => {
    confirmEmailStore.updateConfirmationType(EmailConfirmationType.NULL);

    const wrapper = mountWidget();

    expect(wrapper.find('.headline').text()).toBe('Email Not Confirmed');
    expect(wrapper.text()).toContain('There was an error confirming your email address');
  });

  it('emits the close event when the ok button is clicked', async () => {
    const wrapper = mountWidget();
    const button = wrapper.get('.v-btn');

    await button.trigger('click');

    expect(wrapper.emitted('close-email-confirmed-widget')).toEqual([[undefined, undefined]]);
  });
});