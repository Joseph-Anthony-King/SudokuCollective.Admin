import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, type Pinia } from 'pinia';
import { useServiceFailStore } from '@/stores/serviceFailStore';

describe('the serviceFailStore store', () => {
  let pinia: Pinia;
  beforeEach(() => {
    pinia = createPinia();
  });
  it('should have the expected properties', () => {
    // Arrange and Act
    const sut = useServiceFailStore(pinia);

    sut.$state.isSuccess = false;
    sut.$state.serviceMessage = 'Service message...';
    sut.$state.statusCode = 400;

    // Assert
    expect(sut.isSuccess).toBeTypeOf('boolean');
    expect(sut.serviceMessage).toBeTypeOf('string');
    expect(sut.statusCode).toBeTypeOf('number');
  });
  it('should return the isSuccess value with the getIsSuccess getter', () => {
    // Arrange
    const isFalse = false;
    const sut = useServiceFailStore(pinia);
    sut.$state.isSuccess = isFalse;

    // Act
    const result = sut.getIsSuccess;

    // Assert
    expect(result).toBeFalsy();
    expect(isFalse).toBeFalsy();
    expect(result).equals(isFalse);
  });
  it('should return the serviceMessage value with the getServiceMessage getter', () => {
    // Arrange
    const serviceMessage = 'Service message...';
    const sut = useServiceFailStore(pinia);
    sut.$state.serviceMessage = serviceMessage;

    // Act
    const result = sut.getServiceMessage;

    // Assert
    expect(result).equals(serviceMessage);
  });
  it('should return the statusCode value with the getStatusCode getter', () => {
    // Arrange
    const statusCode = 400;
    const sut = useServiceFailStore(pinia);
    sut.$state.statusCode = statusCode;

    // Act
    const result = sut.getStatusCode;

    // Assert
    expect(result).equals(statusCode);
  });
  it('should update the isSuccess value with the updateIsSuccess mutation', () => {
    // Arrange
    const sut = useServiceFailStore(pinia);
    const initialIsSuccess = sut.$state.isSuccess;

    // Act
    sut.updateIsSuccess(false);
    const finalIsSuccess = sut.getIsSuccess;

    // Assert
    expect(initialIsSuccess).toBeNull();
    expect(finalIsSuccess).toBeTypeOf('boolean');
    expect(finalIsSuccess).toBeFalsy();
    expect(finalIsSuccess).not.equals(initialIsSuccess);
  });
  it('should update the serviceMessage value with the updateServiceMessage mutation', () => {
    // Arrange
    const sut = useServiceFailStore(pinia);
    const initialServiceMessage = sut.$state.serviceMessage;
    const serviceMessage = 'Service message...';

    // Act
    sut.updateServiceMessage(serviceMessage);
    const finalServiceMessage = sut.getServiceMessage;

    // Assert
    expect(initialServiceMessage).toBeNull();
    expect(finalServiceMessage).toBeTypeOf('string');
    expect(finalServiceMessage).equals(serviceMessage)
    expect(finalServiceMessage).not.equals(initialServiceMessage);
  });
  it('should update the statusCode value with the updateStatusCode mutation', () => {
    // Arrange
    const sut = useServiceFailStore(pinia);
    const initialStatusCode = sut.$state.statusCode;
    const statusCode = 400;

    // Act
    sut.updateStatusCode(statusCode);
    const finalStatusCode = sut.getStatusCode;

    // Assert
    expect(initialStatusCode).equals(0);
    expect(finalStatusCode).equals(statusCode)
    expect(finalStatusCode).not.equals(initialStatusCode);
  });
  it('should initialize the store values using the initializeStore action', () => {
    // Arrange
    const sut = useServiceFailStore(pinia);
    const isSuccess = false;
    const serviceMessage = 'Service message...';
    const statusCode = 400;

    sut.$state.isSuccess = isSuccess;
    sut.$state.serviceMessage = serviceMessage;
    sut.$state.statusCode = statusCode;

    const initialIsSuccess = sut.getIsSuccess;
    const initialServiceMessage = sut.getServiceMessage;
    const initialStatusCode = sut.getStatusCode;

    // Act
    sut.initializeStore();

    const finalIsSuccess = sut.getIsSuccess;
    const finalServiceMessage = sut.getServiceMessage;
    const finalStatusCode = sut.getStatusCode;

    expect(initialIsSuccess).equals(isSuccess);
    expect(initialIsSuccess).toBeTypeOf('boolean');
    expect(initialIsSuccess).toBeFalsy();
    expect(finalIsSuccess).toBeNull();
    expect(finalIsSuccess).not.equals(isSuccess);
    expect(finalIsSuccess).not.equals(initialIsSuccess);
    expect(initialServiceMessage).equals(serviceMessage);
    expect(initialServiceMessage).toBeTypeOf('string');
    expect(finalServiceMessage).toBeNull();
    expect(finalServiceMessage).not.equals(serviceMessage);
    expect(finalServiceMessage).not.equals(initialServiceMessage);
    expect(initialStatusCode).equals(statusCode);
    expect(finalStatusCode).equals(0);
    expect(finalStatusCode).not.equals(initialStatusCode);
  });
});
