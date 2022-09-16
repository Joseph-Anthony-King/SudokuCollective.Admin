import { IDifficulty } from '@/interfaces/domain/IDifficulty';

export class Difficulty implements IDifficulty {
  id: number;
  name: string;
  displayName: string;
  difficultyLevel: number;

  constructor(id?: number, name?: string, displayName?: string, difficultyLevel?: number) {
    this.id = id ? id : 0;
    this.name = name ? name : '';
    this.displayName = displayName ? displayName : '';
    this.difficultyLevel = difficultyLevel ? difficultyLevel : 0;
  }
}
