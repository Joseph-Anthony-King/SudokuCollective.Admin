import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, type Pinia } from 'pinia';
import { useDialogStore } from '@/stores/dialogStore';
import { DialogType } from '@/enums/dialogType';

describe('the dialogStore store', () => {
  let pinia: Pinia;
  beforeEach(() => {
    pinia = createPinia();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('should have the expected state properties', () => {
    // Arrange and Act
    const sut = useDialogStore(pinia);

    sut.$state.title = '';
    sut.$state.message = '';
    sut.$state.dialogType = DialogType.OK;
    sut.$state.response = false;
    sut.$state.isActive = false;
    sut.$state.confirmedActionDelegate = () => {
      console.debug('confirmedActionDelegate invoked.');
    };
    sut.$state.notConfirmedActionDelegate = () => {
      console.debug('notConfirmedActionDelegate invoked.');
    };

    // Assert
    expect(sut.title).toBeTypeOf('string');
    expect(sut.message).toBeTypeOf('string');
    expect(sut.dialogType).equals(DialogType.OK);
    expect(sut.response).toBeTypeOf('boolean');
    expect(sut.isActive).toBeTypeOf('boolean');
    expect(sut.confirmedActionDelegate).toBeTypeOf('function');
    expect(sut.notConfirmedActionDelegate).toBeTypeOf('function');
  });
  it('should return the title value with the getDialogTitle getter', () => {
    // Arrange
    const sut = useDialogStore(pinia);
    const title = 'title';
    sut.$state.title = title;

    // Act
    const result = sut.getDialogTitle;

    // Assert
    expect(result).equals('title');
    expect(title).equals('title');
    expect(result).equals(title);
  });
  it('should return the message value with the getDialogMessage getter', () => {
    // Arrange
    const sut = useDialogStore(pinia);
    const message = 'message';
    sut.$state.message = message;

    // Act
    const result = sut.getDialogMessage;

    // Assert
    expect(result).equals('message');
    expect(message).equals('message');
    expect(result).equals(message);
  });
  it('should return the dialogType value with the getDialogType getter', () => {
    // Arrange
    const sut = useDialogStore(pinia);
    const dialogType = DialogType.CONFIRM;
    sut.$state.dialogType = dialogType;

    // Act
    const result = sut.getDialogType;

    // Assert
    expect(result).toBe(DialogType.CONFIRM);
    expect(dialogType).toBe(DialogType.CONFIRM);
    expect(result).equals(dialogType);
  });
  it('should return the response value with the getDialogResponse getter', () => {
    // Arrange
    const sut = useDialogStore(pinia);
    const response = true;
    sut.$state.response = response;

    // Act
    const result = sut.getDialogResponse;

    // Assert
    expect(result).toBe(true);
    expect(response).toBe(true);
    expect(result).equals(response);
  });
  it('should return false when response is null by way of the getDialogResponse getter', () => {
    // Arrange
    const sut = useDialogStore(pinia);

    // Act
    const result = sut.getDialogResponse;

    // Assert
    expect(sut.$state.response).toBeNull();
    expect(result).toBe(false);
  });
  it('should return the isActive value with the getDialogIsActive getter', () => {
    // Arrange
    const sut = useDialogStore(pinia);
    const isActive = true;
    sut.$state.isActive = isActive;

    // Act
    const result = sut.getDialogIsActive;

    // Assert
    expect(result).toBe(true);
    expect(isActive).toBe(true);
    expect(result).equals(isActive);
  });
  it('should update the title property using the updateDialogTitle mutation', () => {
    // Arrange
    const sut = useDialogStore(pinia);
    sut.$state.title = 'title';
    const initialState = sut.getDialogTitle;

    // Act
    sut.updateDialogTitle(`${sut.getDialogTitle}, UPDATED!`);
    const finalState = sut.getDialogTitle;

    // Assert
    expect(initialState).equals('title');
    expect(finalState).equals('title, UPDATED!');
    expect(initialState).not.equals(finalState);
  });
  it('should update the message property using the updateDialogMessage mutation', () => {
    // Arrange
    const sut = useDialogStore(pinia);
    sut.$state.message = 'message';
    const initialState = sut.getDialogMessage;

    // Act
    sut.updateDialogMessage(`${sut.getDialogMessage}, UPDATED!`);
    const finalState = sut.getDialogMessage;

    // Assert
    expect(initialState).equals('message');
    expect(finalState).equals('message, UPDATED!');
    expect(initialState).not.equals(finalState);
  });
  it('should update the dialogType property using the updateDialogType mutation', () => {
    // Arrange
    const sut = useDialogStore(pinia);
    sut.$state.dialogType = DialogType.CONFIRM;
    const initialState = sut.getDialogType;

    // Act
    sut.updateDialogType(DialogType.OK);
    const finalState = sut.getDialogType;

    // Assert
    expect(initialState).equals(DialogType.CONFIRM);
    expect(finalState).equals(DialogType.OK);
    expect(initialState).not.equals(finalState);
  });
  it('should update the response property using the updateDialogResponse mutation', () => {
    // Arrange
    const sut = useDialogStore(pinia);
    sut.$state.response = false;
    const initialState = sut.getDialogResponse;

    // Act
    sut.updateDialogResponse(true);
    const finalState = sut.getDialogResponse;

    // Assert
    expect(initialState).equals(false);
    expect(finalState).equals(true);
    expect(initialState).not.equals(finalState);
  });
  it('should update the isActive property using the updateDialogIsActive mutation', () => {
    // Arrange
    const sut = useDialogStore(pinia);
    sut.$state.isActive = false;
    const initialState = sut.getDialogIsActive;

    // Act
    sut.updateDialogIsActive(true);
    const finalState = sut.getDialogIsActive;

    // Assert
    expect(initialState).equals(false);
    expect(finalState).equals(true);
    expect(initialState).not.equals(finalState);
  });
  it('should update the confirmedActionDelegate property using the updateConfirmedActionDelegate mutation', () => {
    // Arrange
    const sut = useDialogStore(pinia);
    const initialState = sut.$state.confirmedActionDelegate;

    // Act
    const action = () => {
      console.debug('action has been invoked...');
    }
    sut.updateConfirmedActionDelegate(action);
    const finalState = sut.$state.confirmedActionDelegate;

    // Assert
    expect(initialState).toBeNull();
    expect(finalState).toBeTypeOf('function');
    expect(initialState).not.equals(finalState);
  });
  it('should update the notConfirmedActionDelegate property using the updateNotConfirmedActionDelegate mutation', () => {
    // Arrange
    const sut = useDialogStore(pinia);
    const initialState = sut.$state.notConfirmedActionDelegate;

    // Act
    const action = () => {
      console.debug('action has been invoked...');
    }
    sut.updateNotConfirmedActionDelegate(action);
    const finalState = sut.$state.notConfirmedActionDelegate;

    // Assert
    expect(initialState).toBeNull();
    expect(finalState).toBeTypeOf('function');
    expect(initialState).not.equals(finalState);
  });
  it('should update the dialogStore state using the updateDialog mutation', () => {
    // Arrange
    const sut = useDialogStore(pinia);

    const title = sut.$state.title;
    const message = sut.$state.message;
    const type = sut.$state.dialogType;
    const confirmedActionDelegate = sut.$state.confirmedActionDelegate;
    const notConfirmedActionDelegate = sut.$state.notConfirmedActionDelegate;
    const isActive = sut.$state.isActive;

    const titleUpdated = 'title, UPDATED!';
    const messageUpdated = 'message UPDATED!';
    const typeUpdated = DialogType.CONFIRM;
    const confirmedActionDelegateUpdated = () => {
      console.debug('confirmedActionDelegate invoked...');
    }
    const notConfirmedActionDelegateUpdated = () => {
      console.debug('notConfirmedActionDelegate invoked...');
    }

    // Act
    sut.updateDialog(
      titleUpdated, 
      messageUpdated, 
      typeUpdated, 
      confirmedActionDelegateUpdated, 
      notConfirmedActionDelegateUpdated);

    const isActiveUpdated = sut.$state.isActive;

    // Assert
    expect(sut.$state.title).not.equals(title);
    expect(sut.$state.title).equals(titleUpdated);
    expect(titleUpdated).not.equals(title);
    expect(sut.$state.message).not.equals(message);
    expect(sut.$state.message).equals(messageUpdated);
    expect(messageUpdated).not.equals(message);
    expect(sut.$state.dialogType).not.equals(type);
    expect(sut.$state.dialogType).equals(typeUpdated);
    expect(typeUpdated).not.equals(message);
    expect(sut.$state.confirmedActionDelegate).not.equals(confirmedActionDelegate);
    expect(sut.$state.confirmedActionDelegate).equals(confirmedActionDelegateUpdated);
    expect(confirmedActionDelegateUpdated).not.equals(confirmedActionDelegate);
    expect(sut.$state.notConfirmedActionDelegate).not.equals(notConfirmedActionDelegate);
    expect(sut.$state.notConfirmedActionDelegate).equals(notConfirmedActionDelegateUpdated);
    expect(notConfirmedActionDelegateUpdated).not.equals(notConfirmedActionDelegate);
    expect(sut.$state.isActive).not.equals(isActive);
    expect(sut.$state.isActive).equals(isActiveUpdated);
    expect(isActiveUpdated).not.equals(isActive);
  });
  it('should set the stores initial state using the initializeStore action', () => {
    // Arrange
    const sut = useDialogStore(pinia);

    // Act
    sut.initializeStore();

    // Assert
    expect(sut.$state.title).toBeNull();
    expect(sut.$state.message).toBeNull();
    expect(sut.$state.dialogType).toBeNull();
    expect(sut.$state.response).toBeNull();
    expect(sut.$state.isActive).toBe(false);
    expect(sut.$state.confirmedActionDelegate).toBeNull();
    expect(sut.$state.notConfirmedActionDelegate).toBeNull();
  });
  it('should perform the confirmedActionDelegate when not null using the performConfirmedAction action', () => {
    // Arrange
    const sut = useDialogStore(pinia);
    let actionInvoked = false;
    const action = () => {
      actionInvoked = true;
      console.debug(`action has been invoked: ${actionInvoked}`)
    }
    sut.updateConfirmedActionDelegate(action);

    // Act
    sut.performConfirmedAction();

    // Assert
    expect(actionInvoked).toBe(true);
    expect(sut.$state.confirmedActionDelegate).not.toBeNull();
  });
  it('should run the confirmedActionDelegate async when appropriate using the performConfirmedAction action', () => {
    // Arrange
    const sut = useDialogStore(pinia);
    let actionInvoked = false;
    const action = async (): Promise<void> => {
      const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(() => {
            console.debug(`action has been invoked...`);
          });
        }, 100);
      });
      actionInvoked = true;
      promise;
    }
    sut.updateConfirmedActionDelegate(action);

    // Act
    sut.performConfirmedAction();

    // Assert
    expect(actionInvoked).toBe(true);
    expect(sut.$state.confirmedActionDelegate).not.toBeNull();
  });
  it('should perform the notConfirmedActionDelegate when not null using the performNotConfirmedAction action', () => {
    // Arrange
    const sut = useDialogStore(pinia);
    let actionInvoked = false;
    const action = () => {
      actionInvoked = true;
      console.debug(`action has been invoked: ${actionInvoked}`)
    }
    sut.updateNotConfirmedActionDelegate(action);

    // Act
    sut.performNotConfirmedAction();

    // Assert
    expect(actionInvoked).toBe(true);
    expect(sut.$state.notConfirmedActionDelegate).not.toBeNull();
  });
  it('should run the confirmedActionDelegate async when appropriate using the performConfirmedAction action', () => {
    // Arrange
    const sut = useDialogStore(pinia);
    let actionInvoked = false;
    const action = async (): Promise<void> => {
      const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(() => {
            console.debug(`action has been invoked...`);
          });
        }, 100);
      });
      actionInvoked = true;
      promise;
    }
    sut.updateNotConfirmedActionDelegate(action);

    // Act
    sut.performNotConfirmedAction();

    // Assert
    expect(actionInvoked).toBe(true);
    expect(sut.$state.notConfirmedActionDelegate).not.toBeNull();
  });
});
