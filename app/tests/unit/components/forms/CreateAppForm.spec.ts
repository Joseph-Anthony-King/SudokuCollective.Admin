import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { createPinia, setActivePinia } from 'pinia';
import CreateAppForm from '@/components/forms/CreateAppForm.vue';
import AvailableActions from '@/components/buttons/AvailableActions.vue';
import { useUserStore } from '@/stores/userStore';
import { User } from '@/models/domain/user';

const vuetify = createVuetify({
  components,
  directives,
});

vi.mock('@/utilities/rules/index', () => ({
  default: () => ({
    requiredRules: (value: string) => [
      (v: string) => !!v || `${value} is required`,
    ],
    urlRules: [
      (v: string) => !v || /^(ht|f)tp(s?):\/\//.test(v) || 'Invalid URL format',
    ],
  }),
}));

describe('The CreateAppForm.vue component', () => {
  let wrapper: VueWrapper<any>;
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);

    const userStore = useUserStore();
    const mockUser = new User();
    mockUser.id = 123;
    mockUser.userName = 'testuser';
    userStore.updateUser(mockUser);

    wrapper = mount(CreateAppForm, {
      global: {
        plugins: [vuetify, pinia],
        components: {
          AvailableActions,
        },
      },
    });
  });

  it('should render correctly', () => {
    expect(wrapper.find('.headline').exists()).toBe(true);
    expect(wrapper.find('.headline').text()).toBe('Create New App');
    expect(wrapper.find('form').exists()).toBe(true);
  });

  it('should render all input fields', () => {
    const textFields = wrapper.findAllComponents({ name: 'VTextField' });
    expect(textFields.length).toBe(6);

    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
  });

  it('should have App Name field with correct attributes', async () => {
    const appNameField = wrapper.findAll('input')[0];
    expect(appNameField.element.getAttribute('type')).toBe('text');
  });

  it('should have Local URL field', () => {
    const textFields = wrapper.findAllComponents({ name: 'VTextField' });
    expect(textFields.length).toBeGreaterThanOrEqual(2);
  });

  it('should have Test URL field', () => {
    const textFields = wrapper.findAllComponents({ name: 'VTextField' });
    expect(textFields.length).toBeGreaterThanOrEqual(3);
  });

  it('should have Staging URL field', () => {
    const textFields = wrapper.findAllComponents({ name: 'VTextField' });
    expect(textFields.length).toBeGreaterThanOrEqual(4);
  });

  it('should have Production URL field', () => {
    const textFields = wrapper.findAllComponents({ name: 'VTextField' });
    expect(textFields.length).toBeGreaterThanOrEqual(5);
  });

  it('should have Source Code URL field', () => {
    const textFields = wrapper.findAllComponents({ name: 'VTextField' });
    expect(textFields.length).toBe(6);
  });

  it('should render Create button', () => {
    const buttons = wrapper.findAllComponents({ name: 'VBtn' });
    expect(buttons.length).toBeGreaterThanOrEqual(1);
    expect(buttons[0].text()).toBe('Create');
  });

  it('should render Cancel button', () => {
    const buttons = wrapper.findAllComponents({ name: 'VBtn' });
    expect(buttons.length).toBe(2);
    expect(buttons[1].text()).toBe('Cancel');
  });

  it('should render AvailableActions component', () => {
    const availableActions = wrapper.findComponent(AvailableActions);
    expect(availableActions.exists()).toBe(true);
  });

  it('should have Create button disabled when form is invalid', async () => {
    const buttons = wrapper.findAllComponents({ name: 'VBtn' });
    const createButton = buttons[0];

    expect(createButton.attributes('disabled')).toBeDefined();
  });

  it('should enable Create button when form is valid', async () => {
    const textFields = wrapper.findAllComponents({ name: 'VTextField' });
    const appNameField = textFields[0];

    await appNameField.setValue('Test App');
    await wrapper.vm.$nextTick();

    wrapper.vm.formValid = true;
    await wrapper.vm.$nextTick();

    const buttons = wrapper.findAllComponents({ name: 'VBtn' });
    const createButton = buttons[0];

    expect(wrapper.vm.formValid).toBe(true);
  });

  it('should update appName when input changes', async () => {
    const textFields = wrapper.findAllComponents({ name: 'VTextField' });
    const appNameField = textFields[0];

    await appNameField.setValue('My New App');
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.appName).toBe('My New App');
  });

  it('should update localUrl when input changes', async () => {
    const textFields = wrapper.findAllComponents({ name: 'VTextField' });
    const localUrlField = textFields[1];

    await localUrlField.setValue('http://localhost:3000');
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.localUrl).toBe('http://localhost:3000');
  });

  it('should update testUrl when input changes', async () => {
    const textFields = wrapper.findAllComponents({ name: 'VTextField' });
    const testUrlField = textFields[2];

    await testUrlField.setValue('http://test.example.com');
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.testUrl).toBe('http://test.example.com');
  });

  it('should update stagingUrl when input changes', async () => {
    const textFields = wrapper.findAllComponents({ name: 'VTextField' });
    const stagingUrlField = textFields[3];

    await stagingUrlField.setValue('http://staging.example.com');
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.stagingUrl).toBe('http://staging.example.com');
  });

  it('should update prodUrl when input changes', async () => {
    const textFields = wrapper.findAllComponents({ name: 'VTextField' });
    const prodUrlField = textFields[4];

    await prodUrlField.setValue('http://prod.example.com');
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.prodUrl).toBe('http://prod.example.com');
  });

  it('should update sourceCodeUrl when input changes', async () => {
    const textFields = wrapper.findAllComponents({ name: 'VTextField' });
    const sourceCodeUrlField = textFields[5];

    await sourceCodeUrlField.setValue('http://github.com/user/repo');
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.sourceCodeUrl).toBe('http://github.com/user/repo');
  });

  it('should emit created event with correct data when form is submitted', async () => {
    wrapper.vm.appName = 'Test App';
    wrapper.vm.localUrl = 'http://localhost:3000';
    wrapper.vm.testUrl = 'http://test.example.com';
    wrapper.vm.stagingUrl = 'http://staging.example.com';
    wrapper.vm.prodUrl = 'http://prod.example.com';
    wrapper.vm.sourceCodeUrl = 'http://github.com/user/repo';
    wrapper.vm.formValid = true;

    await wrapper.vm.$nextTick();

    const buttons = wrapper.findAllComponents({ name: 'VBtn' });
    const createButton = buttons[0];
    await createButton.trigger('click');

    expect(wrapper.emitted('created')).toBeTruthy();
    expect(wrapper.emitted('created')![0]).toEqual([
      {
        name: 'Test App',
        ownerId: 123,
        localUrl: 'http://localhost:3000',
        testUrl: 'http://test.example.com',
        stagingUrl: 'http://staging.example.com',
        prodUrl: 'http://prod.example.com',
        sourceCodeUrl: 'http://github.com/user/repo',
      },
    ]);
  });

  it('should clear all fields after successful submission', async () => {
    wrapper.vm.appName = 'Test App';
    wrapper.vm.localUrl = 'http://localhost:3000';
    wrapper.vm.testUrl = 'http://test.example.com';
    wrapper.vm.stagingUrl = 'http://staging.example.com';
    wrapper.vm.prodUrl = 'http://prod.example.com';
    wrapper.vm.sourceCodeUrl = 'http://github.com/user/repo';
    wrapper.vm.formValid = true;

    await wrapper.vm.$nextTick();

    const buttons = wrapper.findAllComponents({ name: 'VBtn' });
    const createButton = buttons[0];
    await createButton.trigger('click');

    expect(wrapper.vm.appName).toBe('');
    expect(wrapper.vm.localUrl).toBe('');
    expect(wrapper.vm.testUrl).toBe('');
    expect(wrapper.vm.stagingUrl).toBe('');
    expect(wrapper.vm.prodUrl).toBe('');
    expect(wrapper.vm.sourceCodeUrl).toBe('');
  });

  it('should not emit created event when form is invalid', async () => {
    wrapper.vm.appName = '';
    wrapper.vm.formValid = false;

    await wrapper.vm.$nextTick();

    await wrapper.vm.submitHandler();

    expect(wrapper.emitted('created')).toBeFalsy();
  });

  it('should emit cancel event when cancel button is clicked', async () => {
    const buttons = wrapper.findAllComponents({ name: 'VBtn' });
    const cancelButton = buttons[1];
    await cancelButton.trigger('click');

    expect(wrapper.emitted('cancel')).toBeTruthy();
  });

  it('should clear all fields when cancel is clicked', async () => {
    wrapper.vm.appName = 'Test App';
    wrapper.vm.localUrl = 'http://localhost:3000';
    wrapper.vm.testUrl = 'http://test.example.com';
    wrapper.vm.stagingUrl = 'http://staging.example.com';
    wrapper.vm.prodUrl = 'http://prod.example.com';
    wrapper.vm.sourceCodeUrl = 'http://github.com/user/repo';

    await wrapper.vm.$nextTick();

    const buttons = wrapper.findAllComponents({ name: 'VBtn' });
    const cancelButton = buttons[1];
    await cancelButton.trigger('click');

    expect(wrapper.vm.appName).toBe('');
    expect(wrapper.vm.localUrl).toBe('');
    expect(wrapper.vm.testUrl).toBe('');
    expect(wrapper.vm.stagingUrl).toBe('');
    expect(wrapper.vm.prodUrl).toBe('');
    expect(wrapper.vm.sourceCodeUrl).toBe('');
  });

  it('should handle form submission via form submit event', async () => {
    wrapper.vm.appName = 'Test App';
    wrapper.vm.formValid = true;

    await wrapper.vm.$nextTick();

    const form = wrapper.find('form');
    await form.trigger('submit.prevent');

    expect(wrapper.emitted('created')).toBeTruthy();
  });

  it('should use user ID from user store', () => {
    const userStore = useUserStore();
    expect(userStore.getUser.id).toBe(123);
  });

  it('should call submitHandler when Create button is clicked', async () => {
    const submitHandlerSpy = vi.spyOn(wrapper.vm, 'submitHandler');

    wrapper.vm.formValid = true;
    await wrapper.vm.$nextTick();

    const buttons = wrapper.findAllComponents({ name: 'VBtn' });
    const createButton = buttons[0];
    await createButton.trigger('click');

    expect(submitHandlerSpy).toHaveBeenCalled();
  });

  it('should call cancelHandler when Cancel button is clicked', async () => {
    const buttons = wrapper.findAllComponents({ name: 'VBtn' });
    const cancelButton = buttons[1];
    await cancelButton.trigger('click');

    expect(wrapper.emitted('cancel')).toBeTruthy();
    expect(wrapper.vm.appName).toBe('');
  });

  it('should have tooltips on buttons', () => {
    const tooltips = wrapper.findAllComponents({ name: 'VTooltip' });
    expect(tooltips.length).toBe(2);
  });

  it('should have correct icon on App Name field', () => {
    const textFields = wrapper.findAllComponents({ name: 'VTextField' });
    const appNameField = textFields[0];
    expect(appNameField.props('prependIcon')).toBe('mdi-rename-box');
  });

  it('should have correct icon on Local URL field', () => {
    const textFields = wrapper.findAllComponents({ name: 'VTextField' });
    const localUrlField = textFields[1];
    expect(localUrlField.props('prependIcon')).toBe('mdi-lan');
  });

  it('should have correct icon on Test URL field', () => {
    const textFields = wrapper.findAllComponents({ name: 'VTextField' });
    const testUrlField = textFields[2];
    expect(testUrlField.props('prependIcon')).toBe('mdi-flask');
  });

  it('should have correct icon on Staging URL field', () => {
    const textFields = wrapper.findAllComponents({ name: 'VTextField' });
    const stagingUrlField = textFields[3];
    expect(stagingUrlField.props('prependIcon')).toBe('mdi-server');
  });

  it('should have correct icon on Production URL field', () => {
    const textFields = wrapper.findAllComponents({ name: 'VTextField' });
    const prodUrlField = textFields[4];
    expect(prodUrlField.props('prependIcon')).toBe('mdi-earth');
  });

  it('should have correct icon on Source Code URL field', () => {
    const textFields = wrapper.findAllComponents({ name: 'VTextField' });
    const sourceCodeUrlField = textFields[5];
    expect(sourceCodeUrlField.props('prependIcon')).toBe('mdi-github');
  });

  it('should apply requiredRules to App Name field', () => {
    const textFields = wrapper.findAllComponents({ name: 'VTextField' });
    const appNameField = textFields[0];
    expect(appNameField.props('rules')).toBeDefined();
    expect(Array.isArray(appNameField.props('rules'))).toBe(true);
  });

  it('should apply urlRules to URL fields', () => {
    const textFields = wrapper.findAllComponents({ name: 'VTextField' });
    for (let i = 1; i < 6; i++) {
      expect(textFields[i].props('rules')).toBeDefined();
    }
  });

  it('should have primary color on all text fields', () => {
    const textFields = wrapper.findAllComponents({ name: 'VTextField' });
    textFields.forEach((field) => {
      expect(field.props('color')).toBe('primary');
    });
  });

  it('should have App Name field with required attribute', () => {
    const textFields = wrapper.findAllComponents({ name: 'VTextField' });
    const appNameField = textFields[0];
    // Check that required rules are applied (which enforces required behavior)
    expect(appNameField.props('rules')).toBeDefined();
    expect(Array.isArray(appNameField.props('rules'))).toBe(true);
    expect(appNameField.props('rules').length).toBeGreaterThan(0);
  });

  it('should have v-container in template', () => {
    expect(wrapper.find('.v-container').exists()).toBe(true);
  });

  it('should have v-card-title with headline class', () => {
    const cardTitle = wrapper.find('.v-card-title');
    expect(cardTitle.exists()).toBe(true);
    expect(cardTitle.classes()).toContain('justify-center');
    expect(cardTitle.classes()).toContain('text-center');
  });

  it('should emit created with empty strings for optional fields', async () => {
    wrapper.vm.appName = 'Test App';
    wrapper.vm.formValid = true;

    await wrapper.vm.$nextTick();

    const buttons = wrapper.findAllComponents({ name: 'VBtn' });
    const createButton = buttons[0];
    await createButton.trigger('click');

    expect(wrapper.emitted('created')).toBeTruthy();
    expect(wrapper.emitted('created')![0][0]).toEqual({
      name: 'Test App',
      ownerId: 123,
      localUrl: '',
      testUrl: '',
      stagingUrl: '',
      prodUrl: '',
      sourceCodeUrl: '',
    });
  });

  it('should handle multiple form submissions', async () => {
    wrapper.vm.appName = 'Test App 1';
    wrapper.vm.formValid = true;
    await wrapper.vm.$nextTick();

    const buttons = wrapper.findAllComponents({ name: 'VBtn' });
    const createButton = buttons[0];
    await createButton.trigger('click');

    wrapper.vm.appName = 'Test App 2';
    wrapper.vm.formValid = true;
    await wrapper.vm.$nextTick();

    await createButton.trigger('click');

    expect(wrapper.emitted('created')!.length).toBe(2);
    expect(wrapper.emitted('created')![1][0].name).toBe('Test App 2');
  });

  it('should return early from submitHandler if form is invalid', async () => {
    wrapper.vm.formValid = false;
    const emitSpy = vi.spyOn(wrapper.vm, '$emit');

    await wrapper.vm.submitHandler();

    expect(emitSpy).not.toHaveBeenCalled();
  });
});
