import type { ISudokuRequestData } from '@/interfaces/requests/iSudokuRequestData';

export class SudokuRequestData implements ISudokuRequestData {
  firstRow: number[];
  secondRow: number[];
  thirdRow: number[];
  fourthRow: number[];
  fifthRow: number[];
  sixthRow: number[];
  seventhRow: number[];
  eighthRow: number[];
  ninthRow: number[];

  constructor() {
    this.firstRow = [];
    this.secondRow = [];
    this.thirdRow = [];
    this.fourthRow = [];
    this.fifthRow = [];
    this.sixthRow = [];
    this.seventhRow = [];
    this.eighthRow = [];
    this.ninthRow = [];
  }
}
