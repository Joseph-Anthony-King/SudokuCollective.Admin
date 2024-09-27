import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setActivePinia } from 'pinia';
import { createTestingPinia, type TestingPinia } from '@pinia/testing';
import { StaticServiceMethods } from '@/services/common';
import { useGlobalStore } from '@/stores/globalStore';
import { useServiceFailStore } from '@/stores/serviceFailStore';
import type { AxiosError } from 'axios';

describe('the common port file', () => {
  let testingPinia: TestingPinia;
  let globalStore: any;
  beforeEach(() => {
    testingPinia = createTestingPinia({
      createSpy: vi.fn(),
    });
    const serviceFailStore = useServiceFailStore(testingPinia);
    globalStore = useGlobalStore(testingPinia);

    serviceFailStore.updateIsSuccess = vi.fn();
    serviceFailStore.setServiceMessage = vi.fn();
    serviceFailStore.updateStatusCode = vi.fn();
    globalStore.tokenHasExpired = vi.fn();

    setActivePinia(testingPinia);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('should process failed axios responses running by the processFailedResponse method', () => {
    let result: boolean | null = null;

    try {
      // Arrange
      const testResponse = {
        status: 404,
        data: {
          message: 'Status Code 404: NOT FOUND'
        }
      };
  
      // Act
      StaticServiceMethods.processFailedResponse(testResponse);
      result = true;
    } catch {
      result = false
    }

    // Assert
    expect(result).toBe(true);
    expect(globalStore.tokenHasExpired).not.toHaveBeenCalledOnce();
  });
  it('should process failed axios responses due to invalid request on the token when running the processFailedResponse method', () => {
    let result: boolean | null = null;

    try {
      // Arrange
      const testResponse = {
        status: 403,
        data: {
          message: 'Status Code 403: Invalid request on this authorization token.'
        }
      };
  
      // Act
      StaticServiceMethods.processFailedResponse(testResponse);
      result = true;
    } catch {
      result = false
    }

    // Assert
    expect(result).toBe(true);
    expect(globalStore.tokenHasExpired).toHaveBeenCalledOnce();
  });
  it('should return true if id is greater than 0 when running the isNumberGreaterThanZero method', () => {
    // Arrange and Act
    const result = StaticServiceMethods.isNumberGreaterThanZero(1);

    // Assert
    expect(result).toBe(true);
  });
  it('should return an false if id is 0 when running the isNumberGreaterThanZero method', () => {
    // Arrange and Act
    const result = StaticServiceMethods.isNumberGreaterThanZero(0);

    // Assert
    expect(result).toBe(false);
  });
  it('should return an false if id is negative when running the isNumberGreaterThanZero method', () => {
    // Arrange and Act
    const result = StaticServiceMethods.isNumberGreaterThanZero(-1);

    // Assert
    expect(result).toBe(false);
  });
  it('should return true if string is valid when running the isStringNotEmptyOrNull method', () => {
    // Arrange and Act
    const result = StaticServiceMethods.isStringNotEmptyOrNull('test string');

    // Assert
    expect(result).toBe(true);
  });
  it('should return false if string is empty when running the isStringNotEmptyOrNull method', () => {
    // Arrange and Act
    const result = StaticServiceMethods.isStringNotEmptyOrNull('');

    // Assert
    expect(result).toBe(false);
  });
  it('should return false if string is null when running the isStringNotEmptyOrNull method', () => {
    // Arrange and Act
    const result = StaticServiceMethods.isStringNotEmptyOrNull(null!);

    // Assert
    expect(result).toBe(false);
  });
});
