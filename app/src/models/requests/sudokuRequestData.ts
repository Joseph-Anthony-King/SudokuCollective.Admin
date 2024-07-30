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

  constructor(
    firstRow: number[] | null = null,
    secondRow: number[] | null = null,
    thirdRow: number[] | null = null,
    fourthRow: number[] | null = null,
    fifthRow: number[] | null = null,
    sixthRow: number[] | null = null,
    seventhRow: number[] | null = null,
    eightRow: number[] | null = null,
    ninthRow: number[] | null = null,
  ) {
    firstRow ? (this.firstRow = firstRow) : (this.firstRow = []);
    secondRow ? (this.secondRow = secondRow) : (this.secondRow = []);
    thirdRow ? (this.thirdRow = thirdRow) : (this.thirdRow = []);
    fourthRow ? (this.fourthRow = fourthRow) : (this.fourthRow = []);
    fifthRow ? (this.fifthRow = fifthRow) : (this.fifthRow = []);
    sixthRow ? (this.sixthRow = sixthRow) : (this.sixthRow = []);
    seventhRow ? (this.seventhRow = seventhRow) : (this.seventhRow = []);
    eightRow ? (this.eighthRow = eightRow) : (this.eighthRow = []);
    ninthRow ? (this.ninthRow = ninthRow) : (this.ninthRow = []);
  }
}
