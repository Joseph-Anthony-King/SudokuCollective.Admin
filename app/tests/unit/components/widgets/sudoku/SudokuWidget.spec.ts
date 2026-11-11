import { createTestingPinia } from '@pinia/testing';
import { flushPromises, mount, shallowMount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DialogType } from '@/enums/dialogType';
import { GameState } from '@/enums/gameState';
import { StoreType } from '@/enums/storeTypes';
import SudokuPage from '@/components/pages/SudokuPage.vue';
import SudokuWidget from '@/components/widgets/sudoku/SudokuWidget.vue';
import { Difficulty } from '@/models/domain/difficulty';
import { DropdownItem } from '@/models/infrastructure/dropdownItem';
import { useDialogStore } from '@/stores/dialogStore';
import { useSudokuStore } from '@/stores/sudokuStore';
import { useValueStore } from '@/stores/valueStore';
import SudokuView from '@/views/SudokuView.vue';

const utilities = vi.hoisted(() => ({
  displaySuccessfulToast: vi.fn(),
  displayFailedToastAsync: vi.fn(async () => ({ isSuccess: false })),
  updateAppProcessingAsync: vi.fn(async (action: () => Promise<void>) => {
    await action();
  }),
}));

vi.mock('@/utilities/common', () => ({ default: () => utilities }));

const SelectStub = defineComponent({
  name: 'VSelect',
  props: ['items', 'modelValue', 'label'],
  emits: ['update:modelValue'],
  template: '<div />',
});

const ButtonStub = defineComponent({
  name: 'VBtn',
  props: { disabled: Boolean },
  setup(props, { slots }) {
    return () => h('button', { disabled: props.disabled }, slots.default?.());
  },
});

const SlotStub = defineComponent({
  setup(_, { slots }) {
    return () => h('div', slots.default?.());
  },
});

describe('SudokuView.vue', () => {
  it('renders the Sudoku page', () => {
    const wrapper = shallowMount(SudokuView);

    expect(wrapper.findComponent(SudokuPage).exists()).toBe(true);
  });
});

describe('SudokuWidget.vue', () => {
  const states = [
    new DropdownItem('Play', GameState.PLAYGAME),
    new DropdownItem('Solve', GameState.SOLVESUDOKU),
    new DropdownItem('Generate', GameState.GENERATESUDOKU),
  ];
  const easy = new Difficulty(1, 'Easy', 'Easy', 1);
  const mountainLion = new Difficulty(4, 'Mountain Lion', 'Mountain Lion', 4);
  const shark = new Difficulty(5, 'Shark', 'Shark', 5);
  const matrix = (value: string) => Array.from({ length: 9 }, () => Array(9).fill(value));
  const wrappers: Array<{ unmount: () => void }> = [];
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    utilities.displayFailedToastAsync.mockResolvedValue({ isSuccess: false });
    addEventListenerSpy = vi.spyOn(document, 'addEventListener');
  });

  afterEach(() => {
    wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
    for (const [type, listener] of addEventListenerSpy.mock.calls) {
      if (type === 'keyup' && listener) {
        document.removeEventListener('keyup', listener);
      }
    }
    vi.restoreAllMocks();
  });

  const mountWidget = (state: DropdownItem | null = null, difficulty: Difficulty | null = null) => {
    const pinia = createTestingPinia({ createSpy: vi.fn });
    const sudokuStore = useSudokuStore(pinia);
    const valueStore = useValueStore(pinia);
    const dialogStore = useDialogStore(pinia);
    sudokuStore.$state.gameState = state;
    sudokuStore.$state.selectedDifficulty = difficulty;
    valueStore.$state.gameStates = states;
    valueStore.$state.difficulties = [easy, mountainLion, shark];

    const wrapper = mount(SudokuWidget, {
      global: {
        plugins: [pinia],
        stubs: {
          VContainer: SlotStub,
          VCard: SlotStub,
          VCardText: SlotStub,
          VCardTitle: SlotStub,
          VRow: SlotStub,
          VCol: SlotStub,
          VSelect: SelectStub,
          VBtn: ButtonStub,
          AvailableActions: SlotStub,
          MatrixWidget: true,
        },
      },
    });
    wrappers.push(wrapper);
    return { wrapper, sudokuStore, valueStore, dialogStore };
  };

  const button = (wrapper: ReturnType<typeof mountWidget>['wrapper'], text: string) => {
    const result = wrapper.findAll('button').find((element) => element.text() === text);
    expect(result, `Button "${text}" not found`).toBeDefined();
    if (!result) throw new Error(`Button "${text}" not found`);
    return result;
  };

  it('updates selections and options, showing actions appropriate to each game mode', async () => {
    const { wrapper, sudokuStore, valueStore } = mountWidget();
    expect(wrapper.findAll('button')).toHaveLength(0);
    expect(wrapper.findAllComponents(SelectStub)).toHaveLength(1);
    expect(Reflect.get(wrapper.vm, 'isCurrentGameStateSolveSudoku')).toBe(false);
    expect(sudokuStore.updateGameState).toHaveBeenCalledWith(null);
    expect(sudokuStore.updateSelectedDifficulty).toHaveBeenCalledWith(null);

    const revisedStates = [states[0], states[1]];
    const revisedDifficulties = [easy];
    valueStore.$state.gameStates = revisedStates;
    valueStore.$state.difficulties = revisedDifficulties;
    await nextTick();
    expect(wrapper.findAllComponents(SelectStub)[0].props('items')).toEqual(revisedStates);

    wrapper.findAllComponents(SelectStub)[0].vm.$emit('update:modelValue', states[0]);
    await nextTick();
    expect(sudokuStore.updateGameState).toHaveBeenLastCalledWith(states[0]);
    expect(wrapper.findAllComponents(SelectStub)[1].props('items')).toEqual(revisedDifficulties);
    expect(button(wrapper, 'Create Game').attributes('disabled')).toBeDefined();
    expect(button(wrapper, 'Clear Sudoku').exists()).toBe(true);

    wrapper.findAllComponents(SelectStub)[1].vm.$emit('update:modelValue', easy);
    await nextTick();
    expect(sudokuStore.updateSelectedDifficulty).toHaveBeenLastCalledWith(easy);
    expect(button(wrapper, 'Create Game').attributes('disabled')).toBeUndefined();
    expect(button(wrapper, 'Clear Game').exists()).toBe(true);

    wrapper.findAllComponents(SelectStub)[1].vm.$emit('update:modelValue', null);
    await nextTick();
    expect(sudokuStore.updateSelectedDifficulty).toHaveBeenLastCalledWith(null);
    expect(button(wrapper, 'Create Game').attributes('disabled')).toBeDefined();

    wrapper.findAllComponents(SelectStub)[0].vm.$emit('update:modelValue', states[2]);
    await nextTick();
    expect(button(wrapper, 'Generate Sudoku').exists()).toBe(true);
    expect(button(wrapper, 'Clear Sudoku').exists()).toBe(true);
    expect(wrapper.findAllComponents(SelectStub)).toHaveLength(1);
  });

  it('creates, checks, resets, and clears a game', async () => {
    const { wrapper, sudokuStore } = mountWidget(states[0], easy);
    sudokuStore.$state.game = matrix('1');
    sudokuStore.$state.initialGame = matrix('2');
    await nextTick();

    await button(wrapper, 'Create Game').trigger('click');
    await flushPromises();
    expect(sudokuStore.createGameAsync).toHaveBeenCalledOnce();
    expect(utilities.displaySuccessfulToast).toHaveBeenCalledWith(StoreType.SUDOKUSTORE);
    expect(utilities.displayFailedToastAsync).toHaveBeenCalledWith(undefined, undefined);

    vi.mocked(utilities.displaySuccessfulToast).mockClear();
    await button(wrapper, 'Check Game').trigger('click');
    await flushPromises();
    expect(sudokuStore.checkGameAsync).toHaveBeenCalledOnce();
    expect(utilities.displaySuccessfulToast).toHaveBeenCalledOnce();

    utilities.displayFailedToastAsync.mockResolvedValueOnce({ isSuccess: true });
    vi.mocked(utilities.displaySuccessfulToast).mockClear();
    await button(wrapper, 'Check Game').trigger('click');
    await flushPromises();
    expect(utilities.displaySuccessfulToast).not.toHaveBeenCalled();

    await button(wrapper, 'Reset Game').trigger('click');
    await flushPromises();
    const restoredGame = vi.mocked(sudokuStore.updateGame).mock.calls[0][0];
    expect(restoredGame).toEqual(sudokuStore.$state.initialGame);
    expect(restoredGame).not.toBe(sudokuStore.$state.initialGame);
    expect(restoredGame[0]).not.toBe(sudokuStore.$state.initialGame?.[0]);
    await button(wrapper, 'Clear Game').trigger('click');
    expect(sudokuStore.initializeGame).toHaveBeenCalledOnce();
  });

  it.each([mountainLion, shark])('confirms long-running difficulty $difficultyLevel', async (difficulty) => {
    const { wrapper, sudokuStore, dialogStore } = mountWidget(states[0], difficulty);
    await button(wrapper, 'Create Game').trigger('click');
    expect(sudokuStore.createGameAsync).not.toHaveBeenCalled();
    expect(dialogStore.updateDialog).toHaveBeenCalledWith(
      expect.stringContaining('Confirm Mighty Mountain Lion'),
      expect.stringContaining('30 seconds to 1 minute'),
      DialogType.CONFIRM,
      expect.any(Function),
    );
    const action = vi.mocked(dialogStore.updateDialog).mock.calls[0][3];
    expect(action).toBeDefined();
    if (!action) throw new Error('Missing confirmation action');
    await action();
    expect(sudokuStore.createGameAsync).toHaveBeenCalledOnce();
    expect(utilities.displaySuccessfulToast).toHaveBeenCalledWith(StoreType.SUDOKUSTORE);
    expect(utilities.displayFailedToastAsync).toHaveBeenCalledWith(undefined, undefined);
  });

  it('controls solve actions based on puzzle readiness and the current game', async () => {
    const { wrapper, sudokuStore } = mountWidget(states[1]);
    expect(button(wrapper, 'Solve Sudoku').attributes('disabled')).toBeDefined();
    expect(button(wrapper, 'Current Game').attributes('disabled')).toBeDefined();

    sudokuStore.$state.puzzle = matrix('1');
    sudokuStore.$state.game = matrix('2');
    sudokuStore.$state.isSolveDisabled = true;
    await nextTick();
    expect(button(wrapper, 'Solve Sudoku').attributes('disabled')).toBeDefined();
    expect(button(wrapper, 'Current Game').attributes('disabled')).toBeUndefined();

    sudokuStore.$state.isSolveDisabled = false;
    await nextTick();
    expect(button(wrapper, 'Solve Sudoku').attributes('disabled')).toBeUndefined();
    await button(wrapper, 'Solve Sudoku').trigger('click');
    await flushPromises();
    expect(sudokuStore.solvePuzzleAsync).toHaveBeenCalledOnce();
    expect(utilities.displaySuccessfulToast).toHaveBeenCalledWith(StoreType.SUDOKUSTORE);
    expect(utilities.displayFailedToastAsync).toHaveBeenCalledWith(undefined, undefined);

    await button(wrapper, 'Current Game').trigger('click');
    expect(sudokuStore.updatePuzzle).toHaveBeenCalledWith(sudokuStore.getGame);
    await button(wrapper, 'Clear Sudoku').trigger('click');
    expect(sudokuStore.initializePuzzle).toHaveBeenCalledOnce();
  });

  it('generates and clears a solution', async () => {
    const { wrapper, sudokuStore } = mountWidget(states[2]);
    await button(wrapper, 'Generate Sudoku').trigger('click');
    await flushPromises();
    expect(sudokuStore.generateSolutionAsync).toHaveBeenCalledOnce();
    expect(utilities.displaySuccessfulToast).toHaveBeenCalledWith(StoreType.SUDOKUSTORE);
    expect(utilities.displayFailedToastAsync).toHaveBeenCalledWith(undefined, undefined);

    await button(wrapper, 'Clear Sudoku').trigger('click');
    expect(sudokuStore.initializeSolution).toHaveBeenCalledOnce();
  });

  it.each([
    [states[0], 'checkGameAsync'],
    [states[1], 'solvePuzzleAsync'],
    [states[2], 'generateSolutionAsync'],
  ] as const)('handles Enter in $label mode', async (state, actionName) => {
    const { sudokuStore } = mountWidget(state);
    const event = new KeyboardEvent('keyup', { key: 'Enter', cancelable: true });
    document.dispatchEvent(event);
    await flushPromises();
    expect(sudokuStore[actionName]).toHaveBeenCalledOnce();
    expect(event.defaultPrevented).toBe(true);

    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
    await flushPromises();
    expect(sudokuStore[actionName]).toHaveBeenCalledOnce();
  });

  it.each([
    [null, 'Enter'],
    [states[0], 'Escape'],
  ])('ignores a keyup without a selected mode or Enter', async (state, key) => {
    const { sudokuStore } = mountWidget(state);
    document.dispatchEvent(new KeyboardEvent('keyup', { key }));
    await flushPromises();
    expect(sudokuStore.checkGameAsync).not.toHaveBeenCalled();
    expect(sudokuStore.solvePuzzleAsync).not.toHaveBeenCalled();
    expect(sudokuStore.generateSolutionAsync).not.toHaveBeenCalled();
  });

  it('removes its keyboard listener when unmounted', async () => {
    const { wrapper, sudokuStore } = mountWidget(states[0]);
    wrapper.unmount();
    wrappers.splice(wrappers.indexOf(wrapper), 1);

    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
    await flushPromises();
    expect(sudokuStore.checkGameAsync).not.toHaveBeenCalled();
  });
});