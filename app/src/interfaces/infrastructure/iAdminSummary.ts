import { Difficulty } from '@/models/domain/difficulty';
import { Role } from '@/models/domain/role';
import { DropdownItem } from '@/models/infrastructure/dropdownItem';

export interface IAdminSummary {
  applicationsCount: number;
  difficultiesCount: number;
  emailConfirmationsCount: number;
  gamesCount: number;
  passwordResetsCount: number;
  rolesCount: number;
  solutionsCount: number;
  usersCount: number;
  difficultes: Difficulty[];
  roles: Role[];
  releaseEnvironments: DropdownItem[];
  sortValues: DropdownItem[];
  timeFrames: DropdownItem[];
}
