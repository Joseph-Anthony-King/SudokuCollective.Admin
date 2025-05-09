
import { ref } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { toast } from 'vue3-toastify';
import common from '@/utilities/common';
import { useAppStore } from '@/stores/appStore';
import { useGlobalStore } from '@/stores/globalStore';
import { useLoginFormStore } from '@/stores/formStores/loginFormStore';
import { useServiceFailStore } from '@/stores/serviceFailStore';
import { useSignUpFormStore } from '@/stores/formStores/signUpFormStore';
import { useSudokuStore } from '@/stores/sudokuStore';
import { useUserStore } from '@/stores/userStore';
import { StoreType } from '@/enums/storeTypes';

// Mock the stores
vi.mock('@/stores/appStore');
vi.mock('@/stores/globalStore');
vi.mock('@/stores/formStores/loginFormStore');
vi.mock('@/stores/serviceFailStore');
vi.mock('@/stores/formStores/signUpFormStore');
vi.mock('@/stores/sudokuStore');
vi.mock('@/stores/userStore');
vi.mock('vue3-toastify');

describe('common utility functions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('isChrome', () => {
    it('should detect Chrome browser correctly', () => {
      // Arrange
      const originalUserAgent = navigator.userAgent;
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        configurable: true
      });
      
      // Act
      const commonUtils = common();
      const result = commonUtils.isChrome.value;
      
      // Assert
      expect(result).toBe(true);
      
      // Cleanup
      Object.defineProperty(navigator, 'userAgent', {
        value: originalUserAgent,
        configurable: true
      });
    });

    it('should detect non-Chrome browser correctly', () => {
      // Arrange
      const originalUserAgent = navigator.userAgent;
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Firefox/89.0',
        configurable: true
      });
      
      // Act
      const commonUtils = common();
      const result = commonUtils.isChrome.value;
      
      // Assert
      expect(result).toBe(false);
      
      // Cleanup
      Object.defineProperty(navigator, 'userAgent', {
        value: originalUserAgent,
        configurable: true
      });
    });
  });

  describe('clearStores', () => {
    it('should initialize all stores', () => {
      // Arrange
      const appStoreMock = { initializeStore: vi.fn() };
      const globalStoreMock = { initializeStore: vi.fn() };
      const loginFormStoreMock = { initializeStore: vi.fn() };
      const serviceFailStoreMock = { initializeStore: vi.fn() };
      const signUpFormStoreMock = { initializeStore: vi.fn() };
      const userStoreMock = { initializeStore: vi.fn() };
      
      vi.mocked(useAppStore).mockReturnValue(appStoreMock as any);
      vi.mocked(useGlobalStore).mockReturnValue(globalStoreMock as any);
      vi.mocked(useLoginFormStore).mockReturnValue(loginFormStoreMock as any);
      vi.mocked(useServiceFailStore).mockReturnValue(serviceFailStoreMock as any);
      vi.mocked(useSignUpFormStore).mockReturnValue(signUpFormStoreMock as any);
      vi.mocked(useUserStore).mockReturnValue(userStoreMock as any);
      
      // Act
      const commonUtils = common();
      commonUtils.clearStores();
      
      // Assert
      expect(appStoreMock.initializeStore).toHaveBeenCalledOnce();
      expect(globalStoreMock.initializeStore).toHaveBeenCalledOnce();
      expect(loginFormStoreMock.initializeStore).toHaveBeenCalledOnce();
      expect(serviceFailStoreMock.initializeStore).toHaveBeenCalledOnce();
      expect(signUpFormStoreMock.initializeStore).toHaveBeenCalledOnce();
      expect(userStoreMock.initializeStore).toHaveBeenCalledOnce();
    });
  });

  describe('displaySuccessfulToast', () => {
    it('should display toast with message from user store', () => {
      // Arrange
      const userStoreMock = {
        getServiceMessage: 'Success message',
        updateServiceMessage: vi.fn()
      };
      vi.mocked(useUserStore).mockReturnValue(userStoreMock as any);
      
      // Act
      const commonUtils = common();
      commonUtils.displaySuccessfulToast(StoreType.USERSTORE);
      
      // Assert
      expect(toast).toHaveBeenCalledWith('Success message', {
        position: toast.POSITION.TOP_CENTER,
        type: toast.TYPE.SUCCESS,
      });
      expect(userStoreMock.updateServiceMessage).toHaveBeenCalledOnce();
    });

    it('should display toast with message from sudoku store', () => {
      // Arrange
      const sudokuStoreMock = {
        getServiceMessage: 'Sudoku success message'
      };
      const userStoreMock = {
        updateServiceMessage: vi.fn()
      };
      vi.mocked(useSudokuStore).mockReturnValue(sudokuStoreMock as any);
      vi.mocked(useUserStore).mockReturnValue(userStoreMock as any);
      
      // Act
      const commonUtils = common();
      commonUtils.displaySuccessfulToast(StoreType.SUDOKUSTORE);
      
      // Assert
      expect(toast).toHaveBeenCalledWith('Sudoku success message', {
        position: toast.POSITION.TOP_CENTER,
        type: toast.TYPE.SUCCESS,
      });
      expect(userStoreMock.updateServiceMessage).toHaveBeenCalledOnce();
    });

    it('should not display toast if message is null', () => {
      // Arrange
      const userStoreMock = {
        getServiceMessage: null,
        updateServiceMessage: vi.fn()
      };
      vi.mocked(useUserStore).mockReturnValue(userStoreMock as any);
      
      // Act
      const commonUtils = common();
      commonUtils.displaySuccessfulToast(StoreType.USERSTORE);
      
      // Assert
      expect(toast).not.toHaveBeenCalled();
      expect(userStoreMock.updateServiceMessage).not.toHaveBeenCalled();
    });

    it('should not display toast if message is empty', () => {
      // Arrange
      const userStoreMock = {
        getServiceMessage: '',
        updateServiceMessage: vi.fn()
      };
      vi.mocked(useUserStore).mockReturnValue(userStoreMock as any);
      
      // Act
      const commonUtils = common();
      commonUtils.displaySuccessfulToast(StoreType.USERSTORE);
      
      // Assert
      expect(toast).not.toHaveBeenCalled();
      expect(userStoreMock.updateServiceMessage).not.toHaveBeenCalled();
    });
  });

  describe('displayFailedToastAsync', () => {
    it('should display error toast when service fails', async () => {
      // Arrange
      const serviceFailStoreMock = {
        getIsSuccess: false,
        getServiceMessage: 'Error message',
        initializeStore: vi.fn()
      };
      vi.mocked(useServiceFailStore).mockReturnValue(serviceFailStoreMock as any);
      const callbackMethod = vi.fn();
      
      // Act
      const commonUtils = common();
      const result = await commonUtils.displayFailedToastAsync(callbackMethod, {});
      
      // Assert
      expect(toast).toHaveBeenCalledWith('Error message', {
        position: toast.POSITION.TOP_CENTER,
        type: toast.TYPE.ERROR,
      });
      expect(callbackMethod).toHaveBeenCalledWith('Error message', {});
      expect(serviceFailStoreMock.initializeStore).toHaveBeenCalledOnce();
      expect(result.isSuccess).toBe(false);
    });

    it('should call async callback method when provided', async () => {
      // Arrange
      const serviceFailStoreMock = {
        getIsSuccess: false,
        getServiceMessage: 'Error message',
        initializeStore: vi.fn()
      };
      vi.mocked(useServiceFailStore).mockReturnValue(serviceFailStoreMock as any);
      const asyncCallbackMethod = vi.fn().mockResolvedValue('callback result');
      Object.defineProperty(asyncCallbackMethod, 'constructor', { value: { name: 'AsyncFunction' } });
      
      // Act
      const commonUtils = common();
      const result = await commonUtils.displayFailedToastAsync(asyncCallbackMethod, { test: true });
      
      // Assert
      expect(asyncCallbackMethod).toHaveBeenCalledWith('Error message', { test: true });
      expect(result.methodResult).toBe('callback result');
    });

    it('should not display toast if service success is true', async () => {
      // Arrange
      const serviceFailStoreMock = {
        getIsSuccess: true,
        getServiceMessage: 'Some message',
        initializeStore: vi.fn()
      };
      vi.mocked(useServiceFailStore).mockReturnValue(serviceFailStoreMock as any);
      const callbackMethod = vi.fn();
      
      // Act
      const commonUtils = common();
      const result = await commonUtils.displayFailedToastAsync(callbackMethod, {});
      
      // Assert
      expect(toast).not.toHaveBeenCalled();
      expect(callbackMethod).not.toHaveBeenCalled();
      expect(result.isSuccess).toBe(true);
    });

    it('should handle null service message', async () => {
      // Arrange
      const serviceFailStoreMock = {
        getIsSuccess: false,
        getServiceMessage: null,
        initializeStore: vi.fn()
      };
      vi.mocked(useServiceFailStore).mockReturnValue(serviceFailStoreMock as any);
      const callbackMethod = vi.fn();
      
      // Act
      const commonUtils = common();
      const result = await commonUtils.displayFailedToastAsync(callbackMethod, {});
      
      // Assert
      expect(toast).not.toHaveBeenCalled();
      expect(callbackMethod).not.toHaveBeenCalled();
      expect(result.isSuccess).toBe(false);
    });

    it('should return false for failed when getIsSuccess is null', async () => {
      // Arrange
      const serviceFailStoreMock = {
        getIsSuccess: null,
        getServiceMessage: 'Error message',
        initializeStore: vi.fn()
      };
      vi.mocked(useServiceFailStore).mockReturnValue(serviceFailStoreMock as any);
      const callbackMethod = vi.fn().mockReturnValue();
      
      // Act
      const commonUtils = common();
      const result = await commonUtils.displayFailedToastAsync(callbackMethod, {});
      
      // Assert
      expect(toast).toHaveBeenCalledWith('Error message', {
        position: toast.POSITION.TOP_CENTER,
        type: toast.TYPE.ERROR,
      });
      expect(callbackMethod).toHaveBeenCalledWith('Error message', {});
      expect(serviceFailStoreMock.initializeStore).toHaveBeenCalledOnce();
      expect(result.isSuccess).toBe(false);
    });
  });

  describe('isAsyncFunction', () => {
    it('should identify synchronous function correctly', () => {
      // Arrange
      const syncFn = () => {};
      
      // Act
      const commonUtils = common();
      const result = commonUtils.isAsyncFunction(syncFn);
      
      // Assert
      expect(result).toBe(false);
    });

    it('should identify asynchronous function correctly', () => {
      // Arrange
      const asyncFn = async () => {};
      
      // Act
      const commonUtils = common();
      const result = commonUtils.isAsyncFunction(asyncFn);
      
      // Assert
      expect(result).toBe(true);
    });
  });

  describe('repairAutoComplete', () => {
    it('should set autocomplete attribute to new-password', () => {
      // Arrange
      document.body.innerHTML = `
        <input type="text" autocomplete="off">
        <input type="text" autocomplete="on">
      `;
      
      // Act
      const commonUtils = common();
      commonUtils.repairAutoComplete();
      
      // Assert
      const offInput = document.querySelector('input[autocomplete="new-password"]');
      const onInput = document.querySelector('input[autocomplete="on"]');
      expect(offInput).not.toBeNull();
      expect(onInput).not.toBeNull();
    });
  });

  describe('resetViewPort', () => {
    it('should set isSmallViewPort to true when window width is <= 960', () => {
      // Arrange
      const originalInnerWidth = window.innerWidth;
      Object.defineProperty(window, 'innerWidth', { value: 800, configurable: true });
      const isSmallViewPort = ref(false);
      
      // Act
      const commonUtils = common();
      commonUtils.resetViewPort(isSmallViewPort);
      
      // Assert
      expect(isSmallViewPort.value).toBe(true);
      
      // Cleanup
      Object.defineProperty(window, 'innerWidth', { value: originalInnerWidth, configurable: true });
    });

    it('should set isSmallViewPort to false when window width is > 960', () => {
      // Arrange
      const originalInnerWidth = window.innerWidth;
      Object.defineProperty(window, 'innerWidth', { value: 1200, configurable: true });
      const isSmallViewPort = ref(true);
      
      // Act
      const commonUtils = common();
      commonUtils.resetViewPort(isSmallViewPort);
      
      // Assert
      expect(isSmallViewPort.value).toBe(false);
      
      // Cleanup
      Object.defineProperty(window, 'innerWidth', { value: originalInnerWidth, configurable: true });
    });
  });

  describe('sleepAsync', () => {
    it('should return a promise that resolves after specified delay', async () => {
      // Arrange
      vi.useFakeTimers();
      const commonUtils = common();
      const delay = 500;
      
      // Act
      const promise = commonUtils.sleepAsync(delay);
      vi.advanceTimersByTime(delay);
      
      // Assert
      await expect(promise).resolves.toBeUndefined();
      
      // Cleanup
      vi.useRealTimers();
    });
  });

  describe('updateAppProcessingAsync', () => {
    it('should update processing status and execute synchronous method', async () => {
      // Arrange
      const globalStoreMock = {
        updateProcessingStatus: vi.fn()
      };
      vi.mocked(useGlobalStore).mockReturnValue(globalStoreMock as any);
      const syncMethod = vi.fn().mockReturnValue('test result');
      
      // Act
      const commonUtils = common();
      const result = await commonUtils.updateAppProcessingAsync(syncMethod);
      
      // Assert
      expect(globalStoreMock.updateProcessingStatus).toHaveBeenNthCalledWith(1, true);
      expect(globalStoreMock.updateProcessingStatus).toHaveBeenNthCalledWith(2, false);
      expect(syncMethod).toHaveBeenCalledOnce();
      expect(result).toBe('test result');
    });

    it('should update processing status and execute asynchronous method', async () => {
      // Arrange
      const globalStoreMock = {
        updateProcessingStatus: vi.fn()
      };
      vi.mocked(useGlobalStore).mockReturnValue(globalStoreMock as any);
      const asyncMethod = vi.fn().mockResolvedValue('async test result');
      Object.defineProperty(asyncMethod, 'constructor', { value: { name: 'AsyncFunction' } });
      
      // Act
      const commonUtils = common();
      const result = await commonUtils.updateAppProcessingAsync(asyncMethod);
      
      // Assert
      expect(globalStoreMock.updateProcessingStatus).toHaveBeenNthCalledWith(1, true);
      expect(globalStoreMock.updateProcessingStatus).toHaveBeenNthCalledWith(2, false);
      expect(asyncMethod).toHaveBeenCalledOnce();
      expect(result).toBe('async test result');
    });

    it('should return undefined when method result is undefined', async () => {
      // Arrange
      const globalStoreMock = {
        updateProcessingStatus: vi.fn()
      };
      vi.mocked(useGlobalStore).mockReturnValue(globalStoreMock as any);
      const voidMethod = vi.fn().mockReturnValue(undefined);
      
      // Act
      const commonUtils = common();
      const result = await commonUtils.updateAppProcessingAsync(voidMethod);
      
      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe('updateUrlWithAction', () => {
    it('should push to url when criteria is false', () => {
      // Arrange
      const routerMock = { push: vi.fn() };
      const routeMock = { params: { action: '' } };
      
      // Act
      const commonUtils = common();
      commonUtils.updateUrlWithAction(false, '/test', 'create', routerMock as any, routeMock as any);
      
      // Assert
      expect(routerMock.push).toHaveBeenCalledWith('/test');
    });

    it('should push to url with action when criteria is true and no current action', () => {
      // Arrange
      const routerMock = { push: vi.fn() };
      const routeMock = { params: { action: '' } };
      
      // Act
      const commonUtils = common();
      commonUtils.updateUrlWithAction(true, '/test', 'create', routerMock as any, routeMock as any);
      
      // Assert
      expect(routerMock.push).toHaveBeenCalledWith('/test/create');
    });

    it('should not append slash if url is root', () => {
      // Arrange
      const routerMock = { push: vi.fn() };
      const routeMock = { params: { action: '' } };
      
      // Act
      const commonUtils = common();
      commonUtils.updateUrlWithAction(true, '/', 'create', routerMock as any, routeMock as any);
      
      // Assert
      expect(routerMock.push).toHaveBeenCalledWith('/create');
    });

    it('should do nothing if criteria is true but action is already set', () => {
      // Arrange
      const routerMock = { push: vi.fn() };
      const routeMock = { params: { action: 'existing' } };
      
      // Act
      const commonUtils = common();
      commonUtils.updateUrlWithAction(true, '/test', 'create', routerMock as any, routeMock as any);
      
      // Assert
      expect(routerMock.push).not.toHaveBeenCalled();
    });
  });
});
