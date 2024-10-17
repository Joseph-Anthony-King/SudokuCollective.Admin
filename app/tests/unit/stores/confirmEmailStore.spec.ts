import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type Pinia, createPinia } from 'pinia';
import { useConfirmEmailStore } from '@/stores/confirmEmailStore';
import { EmailConfirmationType } from '@/enums/emailConfirmationType';

describe('the confirmEmailStore store', () => {
  let pinia: Pinia;
  beforeEach(() => {
    pinia = createPinia();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('should have the expected state properties', () => {
    // Arrange and Act
    const sut = useConfirmEmailStore(pinia);

    sut.$state.isSuccess = false;
    sut.$state.confirmationType = EmailConfirmationType.NULL;
    sut.$state.userName = '';
    sut.$state.email = '';

    // Assert
    expect(sut.isSuccess).toBeTypeOf('boolean');
    expect(sut.confirmationType).equals(EmailConfirmationType.NULL);
    expect(sut.userName).toBeTypeOf('string');
    expect(sut.email).toBeTypeOf('string');
  });
  it('should return the isSuccess value with the getIsSuccess getter', () => {
    // Arrange
    const sut = useConfirmEmailStore(pinia);
    sut.$state.isSuccess = false;

    // Act
    const result = sut.getIsSuccess;

    // Assert
    expect(result).toBeTypeOf('boolean');
  });
  it('should return the confirmationType value with the getConfirmationType getter', () => {
    // Arrange
    const sut = useConfirmEmailStore(pinia);
    sut.$state.confirmationType = EmailConfirmationType.NULL;

    // Act
    const result = sut.getConfirmationType;

    // Assert
    expect(result).equals(EmailConfirmationType.NULL);
  });
  it('should return the userName value with the getUserName getter', () => {
    // Arrange
    const sut = useConfirmEmailStore(pinia);
    sut.$state.userName = '';

    // Act
    const result = sut.getUserName;

    // Assert
    expect(result).toBeTypeOf('string');
  });
  it('should return the email value with the getEmail getter', () => {
    // Arrange
    const sut = useConfirmEmailStore(pinia);
    sut.$state.email = '';

    // Act
    const result = sut.getEmail;

    // Assert
    expect(result).toBeTypeOf('string');
  });
  it('should update the isSuccess property using the updateIsSuccess mutation', () => {
    // Arrange
    const sut = useConfirmEmailStore(pinia);
    sut.$state.isSuccess = false;
    const initialState = sut.getIsSuccess!;

    // Act
    sut.updateIsSuccess(true);
    const finalState = sut.getIsSuccess;

    // Assert
    expect(initialState).equals(false);
    expect(finalState).equals(finalState);
    expect(initialState).not.equals(finalState);
  });
  it('should update the confirmationType property using the updateConfirmationType mutation', () => {
    // Arrange
    const sut = useConfirmEmailStore(pinia);
    sut.$state.confirmationType = EmailConfirmationType.NULL;
    const initialState = sut.getConfirmationType;

    // Act
    sut.updateConfirmationType(EmailConfirmationType.NEWEMAILCONFIRMED);
    const finalState = sut.getConfirmationType;

    // Assert
    expect(initialState).equals(EmailConfirmationType.NULL);
    expect(finalState).equals(EmailConfirmationType.NEWEMAILCONFIRMED);
    expect(initialState).not.equals(finalState);
  });
  it('should update the userName property using the updateUserName mutation', () => {
    // Arrange
    const sut = useConfirmEmailStore(pinia);
    sut.$state.userName = '';
    const initialState = sut.getUserName!;

    // Act
    const userName = 'userName';
    sut.updateUserName(userName);
    const finalState = sut.getUserName;

    // Assert
    expect(initialState).equals('');
    expect(finalState).equals(userName);
    expect(initialState).not.equals(finalState);
  });
  it('should update the email property using the updateEmail mutation', () => {
    // Arrange
    const sut = useConfirmEmailStore(pinia);
    sut.$state.email = '';
    const initialState = sut.getEmail!;

    // Act
    const email = 'email@example.com';
    sut.updateEmail(email);
    const finalState = sut.getEmail;

    // Assert
    expect(initialState).equals('');
    expect(finalState).equals(email);
    expect(initialState).not.equals(finalState);
  });
  it('should set the stores initial state using the initializeStore action', () => {
    // Arrange
    const sut = useConfirmEmailStore(pinia);

    // Act
    sut.initializeStore();

    // Assert
    expect(sut.$state.isSuccess).toBeNull();
    expect(sut.$state.confirmationType).equals(EmailConfirmationType.NULL);
    expect(sut.$state.userName).toBeNull();
    expect(sut.$state.email).toBeNull();
  });
});
