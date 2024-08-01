import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
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
    serviceFailStore.updateServiceMessage = vi.fn();
    serviceFailStore.updateStatusCode = vi.fn();
    globalStore.tokenHasExpired = vi.fn();

    setActivePinia(testingPinia);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('should process failed axios responses with the processFailedResponse method', () => {
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
  it('should process failed axios responses due to invalid request on the token with the processFailedResponse method', () => {
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
  it('should return null if id is greater than 0 with the numberCannotBeZero method', () => {
    // Arrange and Act
    const result = StaticServiceMethods.numberCannotBeZero(1);

    // Assert
    expect(result).toBeNull();
  });
  it('should return an AxiosError if id is 0 with the numberCannotBeZero method', () => {
    // Arrange and Act
    const result = StaticServiceMethods.numberCannotBeZero(0) as AxiosError;

    // Assert
    expect(result.response?.status).equals(500);
    expect((<any>result.response?.data).isSuccess).toBe(false);
    expect((<any>result.response?.data).message).toBe('Number cannot be zero');
  });
  it('should return an AxiosError if id is negative with the numberCannotBeZero method', () => {
    // Arrange and Act
    const result = StaticServiceMethods.numberCannotBeZero(-1) as AxiosError;

    // Assert
    expect(result.response?.status).equals(500);
    expect((<any>result.response?.data).isSuccess).toBe(false);
    expect((<any>result.response?.data).message).toBe('Number cannot be zero');
  });
  it('should return null if string is valid with the stringCannotBeEmptyOrNull method', () => {
    // Arrange and Act
    const result = StaticServiceMethods.stringCannotBeEmptyOrNull('test string');

    // Assert
    expect(result).toBeNull();
  });
  it('should return an AxiosError if string is empty with the stringCannotBeEmptyOrNull method', () => {
    // Arrange and Act
    const result = StaticServiceMethods.stringCannotBeEmptyOrNull('') as AxiosError;

    // Assert
    expect(result.response?.status).equals(500);
    expect((<any>result.response?.data).isSuccess).toBe(false);
    expect((<any>result.response?.data).message).toBe('String cannot be null or empty');
  });
  it('should return an AxiosError if string is null with the stringCannotBeEmptyOrNull method', () => {
    // Arrange and Act
    const result = StaticServiceMethods.stringCannotBeEmptyOrNull(null!) as AxiosError;

    // Assert
    expect(result.response?.status).equals(500);
    expect((<any>result.response?.data).isSuccess).toBe(false);
    expect((<any>result.response?.data).message).toBe('String cannot be null or empty');
  });
});
