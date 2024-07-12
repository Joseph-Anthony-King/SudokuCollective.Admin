import type { IDifficulty } from '@/interfaces/domain/iDifficulty';

export class Difficulty implements IDifficulty {
  id: number | null;
  name: string | null;
  displayName: string | null;
  difficultyLevel: number | null;

  constructor(id?: number, name?: string, displayName?: string, difficultyLevel?: number) {
    id ? (this.id = id) : (this.id = null);
    name ? (this.name = name) : (this.name = null);
    displayName ? (this.displayName = displayName) : (this.displayName = null);
    difficultyLevel ? (this.difficultyLevel = difficultyLevel) : (this.difficultyLevel = null);
  }
}
