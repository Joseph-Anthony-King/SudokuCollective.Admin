import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, type Pinia } from 'pinia';
import { useValueStore } from '@/stores/valueStore';
import { ValuesService } from '@/services/valuesService/index';
import type { IServicePayload } from '@/interfaces/infrastructure/iServicePayload';

describe('the valueStore store', () => {
  let pinia: Pinia;
  beforeEach(() => {
    pinia = createPinia();
    vi.stubEnv('NODE_ENV', 'development');
  });
  afterEach(() => {
    vi.resetAllMocks();
  });
  it('should have the expected state properties', () => {
    // Arrange and Act
    const sut = useValueStore(pinia);

    sut.$state.difficulties = [];
    sut.$state.releaseEnvironments = [];
    sut.$state.sortValues = [];
    sut.$state.timeFrames = [];
    sut.$state.gameStates = [];
    sut.$state.gallery = [];
    sut.$state.missionStatement = '';

    // Assert
    expect(sut.difficulties).toBeTypeOf('object');
    expect(sut.releaseEnvironments).toBeTypeOf('object');
    expect(sut.sortValues).toBeTypeOf('object');
    expect(sut.timeFrames).toBeTypeOf('object');
    expect(sut.gameStates).toBeTypeOf('object');
    expect(sut.gallery).toBeTypeOf('object');
    expect(sut.missionStatement).toBeTypeOf('string');
    expect(sut.storeExpirationDate).toBeTypeOf('object');
  });
  it('should have the expected getters', async () => {
    // Arrange
    const sut = useValueStore(pinia);

    await sut.initializeStoreAsync();

    // Act
    const difficulties = sut.getDifficulties;
    const releaseEnvironments = sut.getReleaseEnvironments;
    const sortValues = sut.getSortValues;
    const timeFrames = sut.getTimeFrames;
    const gameStates = sut.getGameStates;
    const gallery = sut.getGallery;
    const missionStatement = sut.getMissionStatement;

    // Assert
    expect(difficulties).toBeTypeOf('object');
    expect(releaseEnvironments).toBeTypeOf('object');
    expect(sortValues).toBeTypeOf('object');
    expect(timeFrames).toBeTypeOf('object');
    expect(gameStates).toBeTypeOf('object');
    expect(gallery).toBeTypeOf('object');
    expect(missionStatement).toBeTypeOf('string');
  });
  it('should initialize store properties using the initializeStoreAsync method', async () => {
    // Arrange
    const sut = useValueStore(pinia);

    const getValuesAsyncSpy = vi.spyOn(ValuesService, 'getValuesAsync');
    getValuesAsyncSpy.mockImplementation(async () => {
      return <IServicePayload>{
        isSuccess: true,
        message: 'Status Code 200: Values were retrieved.',
        difficulties: [{ id: 1, name: 'Easy', displayValue: 'Easy', difficultyLevel: 1 }],
        releaseEnvironments: [{ id: 1, name: 'Development', displayValue: 'Development' }],
        sortValues: [{ id: 1, name: 'Ascending', displayValue: 'Ascending' }],
        timeFrames: [{ id: 1, name: 'Daily', displayValue: 'Daily' }],
        gallery: [{ id: 1, name: 'App1', displayValue: 'App1', active: true }],
        missionStatement: 'Test mission statement'
      };
    });

    // Set the store expiration date to the past to force refresh
    sut.$state.storeExpirationDate = new Date(2020, 1, 1);

    // Act
    await sut.initializeStoreAsync();

    // Assert
    expect(getValuesAsyncSpy).toHaveBeenCalledOnce();
    expect(sut.getDifficulties.length).toBe(1);
    expect(sut.getDifficulties[0].name).toBe('Easy');
    expect(sut.getReleaseEnvironments.length).toBe(1);
    expect(sut.getReleaseEnvironments[0].name).toBe('Development');
    expect(sut.getSortValues.length).toBe(1);
    expect(sut.getSortValues[0].name).toBe('Ascending');
    expect(sut.getTimeFrames.length).toBe(1);
    expect(sut.getTimeFrames[0].name).toBe('Daily');
    expect(sut.getGameStates.length).toBe(3);
    expect(sut.getGallery.length).toBe(1);
    expect(sut.getGallery[0].name).toBe('App1');
    expect(sut.getMissionStatement).toBe('Test mission statement');
    
    // Verify that the store expiration date was updated to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const storeExpirationDate = sut.storeExpirationDate;
    
    // Check if the dates are on the same day (ignoring time)
    expect(storeExpirationDate.getDate()).toBe(tomorrow.getDate());
    expect(storeExpirationDate.getMonth()).toBe(tomorrow.getMonth());
    expect(storeExpirationDate.getFullYear()).toBe(tomorrow.getFullYear());
  });

  it('should not refresh data if store expiration date is in the future', async () => {
    // Arrange
    const sut = useValueStore(pinia);
    
    const getValuesAsyncSpy = vi.spyOn(ValuesService, 'getValuesAsync');
    
    // Set initial values
    sut.$state.difficulties = [{ id: 1, name: 'Easy', displayValue: 'Easy', difficultyLevel: 1 }];
    sut.$state.missionStatement = 'Existing mission statement';
    
    // Set expiration date to tomorrow (future)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    sut.$state.storeExpirationDate = tomorrow;
    
    // Act
    await sut.initializeStoreAsync();
    
    // Assert
    expect(getValuesAsyncSpy).not.toHaveBeenCalled();
    expect(sut.getDifficulties.length).toBe(1);
    expect(sut.getMissionStatement).toBe('Existing mission statement');
  });
});
