import { IDifficultyRequestData } from '@/interfaces/requests/iDifficultyRequestData';

export class DifficultyRequestData implements IDifficultyRequestData {
  id: number;
  name: string;
  displayName: string;
  difficultyLevel: number;

  constructor(id: number, name: string, displayName: string, difficultyLevel: number) {
    this.id = id;
    this.name = name;
    this.displayName = displayName;
    this.difficultyLevel = difficultyLevel;
  }
}
