import { describe, expect, it, beforeEach, vi } from 'vitest';
import { delay, http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { setActivePinia } from 'pinia';
import { createTestingPinia, type TestingPinia } from '@pinia/testing';
import axios, { AxiosError } from 'axios';
import { abortSignal, manualAbortSignal } from '@/ports/common';
import { useGlobalStore } from '@/stores/globalStore';

describe('the common port file', () => {
  let testingPinia: TestingPinia;
  beforeEach(() => {
    testingPinia = createTestingPinia({
      createSpy: vi.fn(),
    });
    const globalStore = useGlobalStore(testingPinia);
    globalStore.updateProcessingStatus = vi.fn();
    globalStore.$state.processingStatus = true;
    setActivePinia(testingPinia);
  });
  it('should obtain an Axios abort signal with the abortSignal method', async () => {
    const delayTimeout = 10000 // 10 seconds
    const abortTimeout = 1000 // 1 second
    try {
      // Arrange
      const testServer = setupServer(
        http.get('https://localhost:5001/fake-timeout', async () => {
          await delay(delayTimeout)
          return HttpResponse.text('timeout complete', {
            status: 200,
          })
        })
      );
  
      testServer.listen();

      // Act
      await axios({
        method: 'get',
        url: 'https://localhost:5001/fake-timeout',
        headers: {
          accept: 'application/text',
          'Content-Type': 'application/text',
          'Access-Control-Allow-Origin': '*',
        },
        signal: abortSignal(abortTimeout)
      });
  
      expect(true).toBe(false);
    } catch (error) {
      const code = (<AxiosError>error).code;
      const message = (<AxiosError>error).message;

      expect(delayTimeout).greaterThan(abortTimeout);
      expect(code).equals('ERR_CANCELED');
      expect(message).equals('canceled');
    }
  });
  it('should return a manual abort signal with the manualAbortSignal method', () => {
    let result = false
    try {
      // Arrange and Act
      const abortSignal = manualAbortSignal();
      if (abortSignal !== undefined) {
        result = true;
      }
    } catch (error) {
      result = false;
    }
    expect(result).toBe(true);
  });
});
