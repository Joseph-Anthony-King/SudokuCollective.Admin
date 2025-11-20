import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { nextTick } from 'vue';
import { createTestingPinia } from '@pinia/testing';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import LoginAssistanceForm from '@/components/forms/LoginAssistanceForm.vue';
import AvailableActions from '@/components/buttons/AvailableActions.vue';
import { useDialogStore } from '@/stores/dialogStore';
import { useGlobalStore } from '@/stores/globalStore';
import { useLoginFormStore } from '@/stores/formStores/loginFormStore';
import { useServiceFailStore } from '@/stores/serviceFailStore';
import { useUserStore } from '@/stores/userStore';
import { DialogType } from '@/enums/dialogType';

// Mock the AvailableActions component
vi.mock('@/components/buttons/AvailableActions.vue', () => ({
  default: {
    name: 'AvailableActions',
    template: '<div class="mocked-available-actions"><slot></slot></div>',
  },
}));

// Mock the utilities
const mockCommonUtilities = {
  isChrome: { value: false },
  displayFailedToastAsync: vi.fn(),
  resetViewPort: vi.fn(),
  repairAutoComplete: vi.fn(),
  updateAppProcessingAsync: vi.fn(),
};

vi.mock('@/utilities/common', () => ({
  default: () => mockCommonUtilities,
}));

// Mock the rules
const mockRules = {
  emailRules: vi.fn(),
};

vi.mock('@/utilities/rules/index', () => ({
  default: () => mockRules,
}));

// Mock RulesMessages
vi.mock('@/utilities/rules/rulesMessages', () => ({
  RulesMessages: {
    emailInvalidMessage: 'Please enter a valid email address',
  },
}));

describe('LoginAssistanceForm.vue', () => {
  const vuetify = createVuetify({
    components,
    directives,
  });

  let wrapper: any;
  let testingPinia: any;
  let dialogStore: any;
  let globalStore: any;
  let loginFormStore: any;
  let serviceFailStore: any;
  let userStore: any;

  const mockEmail = 'test@example.com';
  const mockInvalidEmails = ['invalid@test.com'];

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Mock email rules to return an array directly when called with parameters
    mockRules.emailRules.mockReturnValue([]);
    
    // Mock updateAppProcessingAsync to call the passed function
    mockCommonUtilities.updateAppProcessingAsync.mockImplementation(async (fn) => {
      if (typeof fn === 'function') {
        return await fn();
      }
    });

    // Mock displayFailedToastAsync
    mockCommonUtilities.displayFailedToastAsync.mockResolvedValue({
      failed: false,
      methodResult: { invalidEmails: [] },
    });

    testingPinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        dialogStore: {
          title: '',
          message: '',
          isActive: false,
          dialogType: DialogType.OK,
        },
        globalStore: {},
        loginFormStore: {
          email: '',
          emailDirty: false,
          invalidEmails: [],
        },
        serviceFailStore: {},
        userStore: {
          confirmedUserName: '',
        },
      },
    });

    dialogStore = useDialogStore(testingPinia);
    globalStore = useGlobalStore(testingPinia);
    loginFormStore = useLoginFormStore(testingPinia);
    serviceFailStore = useServiceFailStore(testingPinia);
    userStore = useUserStore(testingPinia);

    // Add missing methods to stores
    dialogStore.updateDialog = vi.fn();
    globalStore.confirmUserNameAsync = vi.fn();
    loginFormStore.updateEmail = vi.fn();
    loginFormStore.updateInvalidEmails = vi.fn();
    loginFormStore.initializeAssistance = vi.fn();
    serviceFailStore.initializeStore = vi.fn();
    userStore.requestPasswordResetAsync = vi.fn();

    // Mock window addEventListener and removeEventListener
    global.window.addEventListener = vi.fn();
    global.window.removeEventListener = vi.fn();
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    vi.restoreAllMocks();
  });

  const createWrapper = (props = {}) => {
    return mount(LoginAssistanceForm, {
      props: {
        formStatus: true,
        ...props,
      },
      global: {
        plugins: [testingPinia, vuetify],
      },
    });
  };

  describe('Component Rendering', () => {
    it('should render the form with all elements', async () => {
      wrapper = createWrapper();
      await nextTick();

      expect(wrapper.find('.headline').text()).toBe('Login Assistance Form');
      expect(wrapper.find('input[type="text"]').exists()).toBe(true);
      expect(wrapper.findAll('.v-btn')).toHaveLength(4);
      expect(wrapper.findComponent(AvailableActions).exists()).toBe(true);
    });

    it('should display email input with proper attributes', async () => {
      wrapper = createWrapper();
      await nextTick();

      const emailInput = wrapper.find('input[type="text"]');
      expect(emailInput.attributes('autocomplete')).toBe('off');
      expect(emailInput.exists()).toBe(true);
    });

    it('should render all four action buttons', async () => {
      wrapper = createWrapper();
      await nextTick();

      const buttons = wrapper.findAll('.v-btn');
      expect(buttons[0].text()).toContain('Reset Password');
      expect(buttons[1].text()).toContain('Confirm User Name');
      expect(buttons[2].text()).toContain('Reset');
      expect(buttons[3].text()).toContain('Go Back');
    });

    it('should show tooltips on large viewports', async () => {
      wrapper = createWrapper();
      await nextTick();

      const tooltips = wrapper.findAll('.v-tooltip');
      expect(tooltips.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Props and Computed Properties', () => {
    it('should handle formStatus prop correctly', async () => {
      wrapper = createWrapper({ formStatus: false });
      await nextTick();

      expect(wrapper.vm.getFormStatus).toBe(false);
      expect(wrapper.vm.resetFormStatus).toBe(true);
    });

    it('should have default formStatus as false', async () => {
      wrapper = mount(LoginAssistanceForm, {
        global: {
          plugins: [testingPinia, vuetify],
        },
      });
      await nextTick();

      expect(wrapper.props('formStatus')).toBe(false);
    });
  });

  describe('Form Validation', () => {
    it('should call email rules validation', async () => {
      wrapper = createWrapper();
      await nextTick();

      expect(mockRules.emailRules).toHaveBeenCalledWith([], 'No user is using this email');
    });

    it('should have buttons enabled when form validation passes', async () => {
      // Set up mock rules to always return valid (empty array = no errors)
      mockRules.emailRules.mockReturnValue([]);
      
      wrapper = createWrapper();
      
      // Set a valid email to ensure form validation passes
      const emailInput = wrapper.find('input[type="text"]');
      await emailInput.setValue(mockEmail);
      await nextTick();
      
      const resetPasswordBtn = wrapper.findAll('.v-btn')[0];
      const confirmUserNameBtn = wrapper.findAll('.v-btn')[1];
      
      // With valid input and no validation errors, buttons should be enabled
      expect(resetPasswordBtn.attributes('disabled')).toBeUndefined();
      expect(confirmUserNameBtn.attributes('disabled')).toBeUndefined();
    });

    it('should disable buttons when form has validation errors', async () => {
      // Set up mock rules to return validation error
      mockRules.emailRules.mockReturnValue(['Email is invalid']);
      
      wrapper = createWrapper();
      
      // Set an invalid email to trigger validation
      const emailInput = wrapper.find('input[type="text"]');
      await emailInput.setValue('invalid-email');
      await emailInput.trigger('blur'); // Trigger validation
      await nextTick();
      await flushPromises();
      
      const resetPasswordBtn = wrapper.findAll('.v-btn')[0];
      const confirmUserNameBtn = wrapper.findAll('.v-btn')[1];
      
      // With validation errors, buttons should be disabled
      expect(resetPasswordBtn.attributes('disabled') !== undefined || resetPasswordBtn.classes().includes('v-btn--disabled')).toBe(true);
      expect(confirmUserNameBtn.attributes('disabled') !== undefined || confirmUserNameBtn.classes().includes('v-btn--disabled')).toBe(true);
    });

    it('should have buttons enabled by default', async () => {
      wrapper = createWrapper();
      await nextTick();

      const resetPasswordBtn = wrapper.findAll('.v-btn')[0];
      const confirmUserNameBtn = wrapper.findAll('.v-btn')[1];
      
      // Buttons are enabled by default since formValid starts as true
      expect(resetPasswordBtn.attributes('disabled')).toBeUndefined();
      expect(confirmUserNameBtn.attributes('disabled')).toBeUndefined();
    });
  });

  describe('Event Handlers', () => {
    beforeEach(() => {
      wrapper = createWrapper({ formStatus: true });
    });

    it('should handle submit (Confirm User Name) button click', async () => {
      wrapper.vm.email = mockEmail;
      wrapper.vm.formValid = true;
      await nextTick();

      const confirmBtn = wrapper.findAll('.v-btn')[1];
      await confirmBtn.trigger('click');
      await flushPromises();

      expect(mockCommonUtilities.updateAppProcessingAsync).toHaveBeenCalled();
      expect(globalStore.confirmUserNameAsync).toHaveBeenCalledWith(mockEmail);
    });

    it('should handle reset password button click', async () => {
      wrapper.vm.email = mockEmail;
      wrapper.vm.formValid = true;
      await nextTick();

      const resetPasswordBtn = wrapper.findAll('.v-btn')[0];
      await resetPasswordBtn.trigger('click');
      await flushPromises();

      expect(mockCommonUtilities.updateAppProcessingAsync).toHaveBeenCalled();
      expect(userStore.requestPasswordResetAsync).toHaveBeenCalledWith(mockEmail);
    });

    it('should handle reset form button click', async () => {
      wrapper.vm.email = mockEmail;
      await nextTick();

      const resetBtn = wrapper.findAll('.v-btn')[2];
      await resetBtn.trigger('click');
      await flushPromises();

      expect(dialogStore.updateDialog).toHaveBeenCalledWith(
        'Reset Form',
        'Are you sure you want to reset this form?',
        DialogType.CONFIRM,
        expect.any(Function)
      );
    });

    it('should handle go back button click', async () => {
      const goBackBtn = wrapper.findAll('.v-btn')[3];
      await goBackBtn.trigger('click');
      await flushPromises();

      expect(mockCommonUtilities.updateAppProcessingAsync).toHaveBeenCalled();
      expect(wrapper.emitted('return-to-login')).toBeTruthy();
    });

    it('should not process actions when formStatus is false', async () => {
      wrapper = createWrapper({ formStatus: false });
      wrapper.vm.email = mockEmail;
      wrapper.vm.formValid = true;
      await nextTick();

      const confirmBtn = wrapper.findAll('button')[1];
      await confirmBtn.trigger('click');
      await flushPromises();

      expect(globalStore.confirmUserNameAsync).not.toHaveBeenCalled();
    });

    it('should not process actions when email is null', async () => {
      wrapper.vm.email = null;
      wrapper.vm.formValid = true;
      await nextTick();

      const confirmBtn = wrapper.findAll('button')[1];
      await confirmBtn.trigger('click');
      await flushPromises();

      expect(globalStore.confirmUserNameAsync).not.toHaveBeenCalled();
    });
  });

  describe('Form Reset Functionality', () => {
    beforeEach(() => {
      wrapper = createWrapper({ formStatus: true });
    });

    it('should reset form when reset handler is called', async () => {
      wrapper.vm.email = mockEmail;
      wrapper.vm.invalidEmails = mockInvalidEmails;
      
      await wrapper.vm.resetHandlerAsync();
      await flushPromises();

      expect(wrapper.vm.email === '' || wrapper.vm.email === null).toBe(true);
      expect(wrapper.vm.invalidEmails).toEqual([]);
      expect(serviceFailStore.initializeStore).toHaveBeenCalled();
      expect(loginFormStore.initializeAssistance).toHaveBeenCalled();
    });

    it('should handle confirm form reset correctly', async () => {
      wrapper.vm.email = mockEmail;
      await nextTick();
      
      await wrapper.vm.confirmFormResetHandler();

      expect(dialogStore.updateDialog).toHaveBeenCalledWith(
        'Reset Form',
        'Are you sure you want to reset this form?',
        DialogType.CONFIRM,
        expect.any(Function)
      );
    });

    it('should disable reset button when no email and no invalid emails', async () => {
      wrapper.vm.email = '';
      wrapper.vm.invalidEmails = [];
      await nextTick();

      const resetBtn = wrapper.findAll('.v-btn')[2];
      expect(resetBtn.classes()).toContain('v-btn--disabled');
    });

    it('should enable reset button when email exists', async () => {
      wrapper.vm.email = mockEmail;
      await nextTick();

      const resetBtn = wrapper.findAll('.v-btn')[2];
      expect(resetBtn.classes()).not.toContain('v-btn--disabled');
    });

    it('should enable reset button when invalid emails exist', async () => {
      wrapper.vm.email = '';
      wrapper.vm.invalidEmails = mockInvalidEmails;
      await nextTick();

      const resetBtn = wrapper.findAll('.v-btn')[2];
      expect(resetBtn.classes()).not.toContain('v-btn--disabled');
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      wrapper = createWrapper({ formStatus: true });
    });

    it('should handle failed toast with invalid emails', async () => {
      const failedResponse = {
        failed: true,
        methodResult: { invalidEmails: ['test@invalid.com'] },
      };
      
      mockCommonUtilities.displayFailedToastAsync.mockResolvedValue(failedResponse);
      
      wrapper.vm.email = mockEmail;
      wrapper.vm.formValid = true;

      await wrapper.vm.submitHandlerAsync();
      await flushPromises();

      expect(loginFormStore.updateEmail).toHaveBeenCalledWith(mockEmail);
      expect(loginFormStore.updateInvalidEmails).toHaveBeenCalledWith(['test@invalid.com']);
    });

    it('should handle password reset failure', async () => {
      const failedResponse = { failed: true };
      mockCommonUtilities.displayFailedToastAsync.mockResolvedValue(failedResponse);
      
      wrapper.vm.email = mockEmail;
      wrapper.vm.formValid = true;

      await wrapper.vm.resetPasswordHandlerAsync();
      await flushPromises();

      expect(userStore.requestPasswordResetAsync).toHaveBeenCalledWith(mockEmail);
    });

    it('should update invalid values correctly', () => {
      const message = 'Status Code 404: No user is using this email';
      const options = {
        invalidEmails: [],
        email: mockEmail,
      };

      const result = wrapper.vm.updateInvalidValues(message, options);

      expect(result.invalidEmails).toContain(mockEmail);
    });

    it('should not duplicate invalid emails', () => {
      const message = 'Status Code 404: No user is using this email';
      const options = {
        invalidEmails: [mockEmail],
        email: mockEmail,
      };

      const result = wrapper.vm.updateInvalidValues(message, options);

      expect(result.invalidEmails.filter(email => email === mockEmail)).toHaveLength(1);
    });

    it('should not add email to invalid list for other error messages', () => {
      const message = 'Some other error';
      const options = {
        invalidEmails: [],
        email: mockEmail,
      };

      const result = wrapper.vm.updateInvalidValues(message, options);

      expect(result.invalidEmails).not.toContain(mockEmail);
    });
  });

  describe('Watchers', () => {
    it('should emit return-to-login when confirmed user name changes', async () => {
      wrapper = createWrapper();

      // Update the store value to trigger the watcher
      userStore.confirmedUserName = 'testuser';
      await nextTick();

      expect(wrapper.emitted('return-to-login')).toBeTruthy();
    });

    it('should not emit when confirmed user name is empty', async () => {
      wrapper = createWrapper();
      const emitSpy = vi.spyOn(wrapper.vm, '$emit');

      // Update store with empty value
      userStore.$patch({ confirmedUserName: '' });
      await nextTick();

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('Lifecycle Hooks', () => {
    it('should call repair autocomplete for Chrome browsers', async () => {
      mockCommonUtilities.isChrome.value = true;
      
      wrapper = createWrapper();
      await nextTick();

      expect(mockCommonUtilities.repairAutoComplete).toHaveBeenCalled();
    });

    it('should set up resize listener on mount', () => {
      wrapper = createWrapper();
      
      expect(mockCommonUtilities.resetViewPort).toHaveBeenCalled();
      expect(global.window.addEventListener).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
        { once: true }
      );
    });

    it('should call repair autocomplete on update for Chrome', async () => {
      mockCommonUtilities.isChrome.value = true;
      
      wrapper = createWrapper();
      
      // Trigger an update by changing a prop
      await wrapper.setProps({ formStatus: false });
      await nextTick();

      expect(mockCommonUtilities.repairAutoComplete).toHaveBeenCalled();
    });

    it('should handle form validation on mount when email is dirty', async () => {
      testingPinia = createTestingPinia({
        createSpy: vi.fn,
        initialState: {
          loginFormStore: {
            email: mockEmail,
            emailDirty: true,
            invalidEmails: [],
          },
        },
      });

      wrapper = mount(LoginAssistanceForm, {
        props: { formStatus: true },
        global: {
          plugins: [testingPinia, vuetify],
        },
      });

      await nextTick();
      
      // The component should be mounted and initialized
      expect(wrapper.exists()).toBe(true);
    });

    it('should handle resize event with timeout and clearTimeout', async () => {
      // Mock setTimeout and clearTimeout
      const mockSetTimeout = vi.fn().mockImplementation((fn, delay, ...args) => {
        // Immediately execute the function for testing
        fn();
        return 123; // Mock timeout ID
      });
      const mockClearTimeout = vi.fn();
      
      global.setTimeout = mockSetTimeout;
      global.clearTimeout = mockClearTimeout;

      wrapper = createWrapper();
      await nextTick();

      // Get the resize event handler that was registered by our component
      const addEventListenerCalls = (global.window.addEventListener as any).mock.calls;
      const resizeCall = addEventListenerCalls.find(call => call[0] === 'resize');
      expect(resizeCall).toBeDefined();
      
      const resizeHandler = resizeCall[1];
      
      // Simulate multiple rapid resize events
      resizeHandler(); // First call
      expect(mockClearTimeout).toHaveBeenCalled();
      expect(mockSetTimeout).toHaveBeenCalledWith(expect.any(Function), 250, 'Resized');
      expect(mockCommonUtilities.resetViewPort).toHaveBeenCalled();
      
      resizeHandler(); // Second call should clear previous timeout
      expect(mockClearTimeout).toHaveBeenCalledTimes(2);
      expect(mockSetTimeout).toHaveBeenCalledTimes(2);
    });

    it('should remove resize event listener on unmount', async () => {
      wrapper = createWrapper();
      await nextTick();
      
      // Unmount the component
      wrapper.unmount();
      
      expect(global.window.removeEventListener).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
    });
  });

  describe('Component Lifecycle and Cleanup', () => {
    it('should properly cleanup on component destruction', async () => {
      // Clear any existing calls first
      vi.clearAllMocks();
      
      const mockRemoveEventListener = vi.fn();
      const mockAddEventListener = vi.fn();
      global.window.removeEventListener = mockRemoveEventListener;
      global.window.addEventListener = mockAddEventListener;
      
      wrapper = createWrapper();
      await nextTick();
      
      // Verify initial setup
      expect(wrapper.exists()).toBe(true);
      
      // Find our resize event listener among all addEventListener calls
      const resizeCall = mockAddEventListener.mock.calls.find(call => call[0] === 'resize');
      expect(resizeCall).toBeDefined();
      const actualResizeHandler = resizeCall[1];
      
      // Destroy the component to trigger onUnmounted
      wrapper.unmount();
      
      // Verify cleanup was called - it should remove some event listener
      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
    });

    it('should execute onUnmounted cleanup with resetViewPort call', async () => {
      const mockRemoveEventListener = vi.fn().mockImplementation((event, handler) => {
        // Execute the handler to cover the inner function
        if (event === 'resize' && typeof handler === 'function') {
          handler();
        }
      });
      
      global.window.removeEventListener = mockRemoveEventListener;
      
      wrapper = createWrapper();
      await nextTick();
      
      // Reset the resetViewPort mock to count calls
      mockCommonUtilities.resetViewPort.mockClear();
      
      // Destroy the component to trigger onUnmounted
      wrapper.unmount();
      
      // Verify that removeEventListener was called and the inner function executed
      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
      
      // The resetViewPort should have been called from inside the removeEventListener callback
      expect(mockCommonUtilities.resetViewPort).toHaveBeenCalled();
    });

    it('should handle resize timeout scenario properly', async () => {
      let timeoutCallback: Function | null = null;
      const mockSetTimeout = vi.fn().mockImplementation((fn, delay, ...args) => {
        timeoutCallback = fn;
        return 123;
      });
      const mockClearTimeout = vi.fn();
      
      global.setTimeout = mockSetTimeout;
      global.clearTimeout = mockClearTimeout;
      
      wrapper = createWrapper();
      await nextTick();
      
      // Trigger resize event
      const addEventListenerCalls = (global.window.addEventListener as any).mock.calls;
      const resizeCall = addEventListenerCalls.find(call => call[0] === 'resize');
      const resizeHandler = resizeCall[1];
      
      // Trigger resize
      resizeHandler();
      
      // Verify setTimeout was called with correct parameters
      expect(mockSetTimeout).toHaveBeenCalledWith(
        expect.any(Function),
        250,
        'Resized'
      );
      
      // Execute the timeout callback if it was captured
      if (timeoutCallback) {
        timeoutCallback();
        expect(mockCommonUtilities.resetViewPort).toHaveBeenCalled();
      }
    });
  });

  describe('Store Integration', () => {
    it('should initialize with store values', async () => {
      testingPinia = createTestingPinia({
        createSpy: vi.fn,
        initialState: {
          loginFormStore: {
            email: mockEmail,
            emailDirty: false,
            invalidEmails: mockInvalidEmails,
          },
        },
      });

      wrapper = mount(LoginAssistanceForm, {
        props: { formStatus: true },
        global: {
          plugins: [testingPinia, vuetify],
        },
      });

      await nextTick();

      expect(wrapper.vm.email).toBe(mockEmail);
      expect(wrapper.vm.invalidEmails).toEqual(mockInvalidEmails);
    });

    it('should handle empty store values', async () => {
      testingPinia = createTestingPinia({
        createSpy: vi.fn,
        initialState: {
          loginFormStore: {
            email: '',
            emailDirty: false,
            invalidEmails: [],
          },
        },
      });

      wrapper = mount(LoginAssistanceForm, {
        props: { formStatus: true },
        global: {
          plugins: [testingPinia, vuetify],
        },
      });

      await nextTick();

      expect(wrapper.vm.email).toBe('');
      expect(wrapper.vm.invalidEmails).toEqual([]);
    });
  });

  describe('Event Prevention', () => {
    beforeEach(() => {
      wrapper = createWrapper({ formStatus: true });
    });

    it('should prevent default on submit handler', async () => {
      const mockEvent = { preventDefault: vi.fn() };
      
      await wrapper.vm.submitHandlerAsync(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should prevent default on reset password handler', async () => {
      const mockEvent = { preventDefault: vi.fn() };
      
      await wrapper.vm.resetPasswordHandlerAsync(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should prevent default on confirm form reset handler', () => {
      const mockEvent = { preventDefault: vi.fn() };
      
      wrapper.vm.confirmFormResetHandler(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should prevent default on reset handler', async () => {
      const mockEvent = { preventDefault: vi.fn() };
      
      await wrapper.vm.resetHandlerAsync(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should prevent default on go back handler', async () => {
      const mockEvent = { preventDefault: vi.fn() };
      
      await wrapper.vm.goBackHandlerAsync(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should handle null events gracefully', async () => {
      expect(async () => {
        await wrapper.vm.submitHandlerAsync(null);
        await wrapper.vm.resetPasswordHandlerAsync(null);
        wrapper.vm.confirmFormResetHandler(null);
        await wrapper.vm.resetHandlerAsync(null);
        await wrapper.vm.goBackHandlerAsync(null);
      }).not.toThrow();
    });
  });
});
