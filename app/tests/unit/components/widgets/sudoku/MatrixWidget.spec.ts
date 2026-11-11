import { defineComponent, h, type PropType } from 'vue';
import { mount, type DOMWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import MatrixWidget from '@/components/widgets/sudoku/MatrixWidget.vue';
import { GameState } from '@/enums/gameState';
import { DropdownItem } from '@/models/infrastructure/dropdownItem';
import { useSudokuStore } from '@/stores/sudokuStore';

const SudokuCellStub = defineComponent({
  name: 'VTextField',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    tabindex: {
      type: Number,
      default: 0,
    },
    bgColor: {
      type: String as PropType<string>,
      default: '',
    },
  },
  emits: ['update:modelValue', 'blur'],
  setup(props, { emit }) {
    return () =>
      h('input', {
        class: 'sudoku-cell',
        type: 'number',
        value: props.modelValue,
        readonly: props.readonly,
        tabindex: props.tabindex,
        'data-bg-color': props.bgColor,
        onInput: (event: Event) =>
          emit('update:modelValue', (event.target as HTMLInputElement).value),
        onBlur: () => emit('blur'),
      });
  },
});

const RowStub = defineComponent({
  name: 'VRow',
  setup(_, { slots }) {
    return () => h('div', { class: 'v-row' }, slots.default?.());
  },
});

const CardTitleStub = defineComponent({
  name: 'VCardTitle',
  setup(_, { slots }) {
    return () => h('h2', { class: 'v-card-title' }, slots.default?.());
  },
});

const createMatrix = (value = ''): string[][] =>
  Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => value));

describe('MatrixWidget.vue', () => {
  let sudokuStore: ReturnType<typeof useSudokuStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    sudokuStore = useSudokuStore();
  });

  const setGameState = (state: GameState | null) => {
    sudokuStore.updateGameState(state === null ? null : new DropdownItem('State', state));
  };

  const mountWidget = () =>
    mount(MatrixWidget, {
      global: {
        stubs: {
          VTextField: SudokuCellStub,
          VRow: RowStub,
          VCardTitle: CardTitleStub,
        },
      },
    });

  const cells = (wrapper: ReturnType<typeof mountWidget>): DOMWrapper<HTMLInputElement>[] =>
    wrapper.findAll<HTMLInputElement>('.sudoku-cell');

  const updateCell = async (
    wrapper: ReturnType<typeof mountWidget>,
    index: number,
    value: string,
  ) => {
    const cell = cells(wrapper)[index];
    await cell.setValue(value);
    await cell.trigger('blur');
  };

  it('renders the title, a 9x9 blank matrix, and readonly cells without a game state', () => {
    setGameState(null);
    const wrapper = mountWidget();

    expect(wrapper.get('.v-card-title').text()).toBe('Sudoku Collective');
    expect(cells(wrapper)).toHaveLength(81);
    expect(cells(wrapper).every((cell) => cell.element.value === '')).toBe(true);
    expect(cells(wrapper).every((cell) => cell.attributes('readonly') !== undefined)).toBe(true);
    expect(cells(wrapper).every((cell) => cell.attributes('tabindex') === '-1')).toBe(true);
    expect(cells(wrapper)[0].attributes('data-bg-color')).toBe('primary');
    expect(cells(wrapper)[4].attributes('data-bg-color')).toBe('white');
  });

  it('loads game values and applies readonly and color styling to initial clues', () => {
    const game = createMatrix('2');
    const initialGame = createMatrix();
    initialGame[0][0] = '2';
    sudokuStore.updateGame(game);
    sudokuStore.updateInitialGame(initialGame);
    setGameState(GameState.PLAYGAME);

    const wrapper = mountWidget();
    const inputCells = cells(wrapper);

    expect(inputCells[0].element.value).toBe('2');
    expect(inputCells[0].attributes('readonly')).toBeDefined();
    expect(inputCells[0].attributes('tabindex')).toBe('-1');
    expect(inputCells[0].classes()).toContain('text-yellow');
    expect(inputCells[1].attributes('readonly')).toBeUndefined();
    expect(inputCells[1].attributes('tabindex')).toBe('0');
    expect(inputCells[1].classes()).toContain('text-white');
    expect(inputCells[4].classes()).toContain('text-black');
    expect(inputCells[0].attributes('data-bg-color')).toBe('primary');
    expect(inputCells[4].attributes('data-bg-color')).toBe('white');
  });

  it('loads the puzzle and permits edits in solve mode', () => {
    const puzzle = createMatrix('3');
    sudokuStore.updatePuzzle(puzzle);
    setGameState(GameState.SOLVESUDOKU);

    const wrapper = mountWidget();

    expect(cells(wrapper)).toHaveLength(81);
    expect(cells(wrapper)[0].element.value).toBe('3');
    expect(cells(wrapper).every((cell) => cell.attributes('readonly') === undefined)).toBe(true);
  });

  it('loads the solution and makes cells readonly in generate mode', () => {
    const solution = createMatrix('4');
    sudokuStore.updateSolution(solution);
    setGameState(GameState.GENERATESUDOKU);

    const wrapper = mountWidget();

    expect(cells(wrapper)[0].element.value).toBe('4');
    expect(cells(wrapper).every((cell) => cell.attributes('readonly') !== undefined)).toBe(true);
  });

  it('clears entries outside the allowed range and leaves empty entries unchanged', async () => {
    setGameState(GameState.PLAYGAME);
    sudokuStore.updateGame(createMatrix());
    sudokuStore.updateInitialGame(createMatrix());
    const wrapper = mountWidget();

    await updateCell(wrapper, 0, '0');
    expect(cells(wrapper)[0].element.value).toBe('');
    await updateCell(wrapper, 0, '10');
    expect(cells(wrapper)[0].element.value).toBe('');
    await updateCell(wrapper, 0, '');
    expect(cells(wrapper)[0].element.value).toBe('');
    expect(sudokuStore.getGame[0][0]).toBe('');
  });

  it.each(['1', '9'])('accepts in-range value %s and saves the full game matrix', async (value) => {
    setGameState(GameState.PLAYGAME);
    sudokuStore.updateGame(createMatrix());
    sudokuStore.updateInitialGame(createMatrix());
    const updateGameSpy = vi.spyOn(sudokuStore, 'updateGame');
    const wrapper = mountWidget();

    await updateCell(wrapper, 0, value);

    expect(updateGameSpy).toHaveBeenCalledOnce();
    expect(updateGameSpy.mock.calls[0][0]).toHaveLength(9);
    expect(updateGameSpy.mock.calls[0][0].every((row) => row.length === 9)).toBe(true);
    expect(sudokuStore.getGame[0][0]).toBe(value);
  });

  it('saves valid entries to the puzzle in solve mode', async () => {
    setGameState(GameState.SOLVESUDOKU);
    sudokuStore.updatePuzzle(createMatrix());
    const updatePuzzleSpy = vi.spyOn(sudokuStore, 'updatePuzzle');
    const wrapper = mountWidget();

    await updateCell(wrapper, 10, '7');

    expect(updatePuzzleSpy).toHaveBeenCalledOnce();
    expect(sudokuStore.getPuzzle[1][1]).toBe('7');
  });

  it('does not save valid edits in generate mode', async () => {
    setGameState(GameState.GENERATESUDOKU);
    sudokuStore.updateSolution(createMatrix());
    const updateGameSpy = vi.spyOn(sudokuStore, 'updateGame');
    const updatePuzzleSpy = vi.spyOn(sudokuStore, 'updatePuzzle');
    const wrapper = mountWidget();

    await updateCell(wrapper, 0, '5');

    expect(updateGameSpy).not.toHaveBeenCalled();
    expect(updatePuzzleSpy).not.toHaveBeenCalled();
    expect(cells(wrapper)[0].element.value).toBe('5');
  });

  it('refreshes the displayed matrix when game state and active matrices change', async () => {
    const wrapper = mountWidget();

    const game = createMatrix('1');
    sudokuStore.updateGame(game);
    sudokuStore.updateInitialGame(createMatrix());
    setGameState(GameState.PLAYGAME);
    await wrapper.vm.$nextTick();
    expect(cells(wrapper)[0].element.value).toBe('1');

    const updatedGame = createMatrix('1');
    updatedGame[0][0] = '6';
    sudokuStore.updateGame(updatedGame);
    await wrapper.vm.$nextTick();
    expect(cells(wrapper)[0].element.value).toBe('6');

    const puzzle = createMatrix('2');
    sudokuStore.updatePuzzle(puzzle);
    setGameState(GameState.SOLVESUDOKU);
    await wrapper.vm.$nextTick();
    expect(cells(wrapper)[0].element.value).toBe('2');

    const updatedPuzzle = createMatrix('2');
    updatedPuzzle[0][0] = '8';
    sudokuStore.updatePuzzle(updatedPuzzle);
    await wrapper.vm.$nextTick();
    expect(cells(wrapper)[0].element.value).toBe('8');

    const solution = createMatrix('3');
    sudokuStore.updateSolution(solution);
    setGameState(GameState.GENERATESUDOKU);
    await wrapper.vm.$nextTick();
    expect(cells(wrapper)[0].element.value).toBe('3');

    const updatedSolution = createMatrix('3');
    updatedSolution[0][0] = '9';
    sudokuStore.updateSolution(updatedSolution);
    await wrapper.vm.$nextTick();
    expect(cells(wrapper)[0].element.value).toBe('9');
  });
});