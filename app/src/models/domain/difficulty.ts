import type { IDifficulty } from '@/interfaces/domain/iDifficulty';

export class Difficulty implements IDifficulty {
  id: number;
  name: string;
  displayName: string;
  difficultyLevel: number;

  constructor(id?: number, name?: string, displayName?: string, difficultyLevel?: number) {
    id ? (this.id = id) : (this.id = 0);
    name ? (this.name = name) : (this.name = '');
    displayName ? (this.displayName = displayName) : (this.displayName = '');
    difficultyLevel ? (this.difficultyLevel = difficultyLevel) : (this.difficultyLevel = 0);
  }
}
