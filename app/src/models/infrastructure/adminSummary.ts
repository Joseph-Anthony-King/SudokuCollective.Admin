import { IAdminSummary } from '@/interfaces/infrastructure/iAdminSummary';
import { Difficulty } from '../domain/difficulty';
import { Role } from '../domain/role';
import { DropdownItem } from './dropdownItem';

export class AdminSummary implements IAdminSummary {
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

  constructor(
    applicationsCount?: number,
    difficultiesCount?: number,
    emailConfirmationsCount?: number,
    gamesCount?: number,
    passwordResetsCount?: number,
    rolesCount?: number,
    solutionsCount?: number,
    usersCount?: number,
    difficulties?: Difficulty[],
    roles?: Role[],
    releaseEnvironments?: DropdownItem[],
    sortValues?: DropdownItem[],
    timeFrames?: DropdownItem[],
  ) {
    applicationsCount !== undefined
      ? (this.applicationsCount = applicationsCount)
      : (this.applicationsCount = 0);
    difficultiesCount !== undefined
      ? (this.difficultiesCount = difficultiesCount)
      : (this.difficultiesCount = 0);
    emailConfirmationsCount !== undefined
      ? (this.emailConfirmationsCount = emailConfirmationsCount)
      : (this.emailConfirmationsCount = 0);
    gamesCount !== undefined ? (this.gamesCount = gamesCount) : (this.gamesCount = 0);
    passwordResetsCount !== undefined
      ? (this.passwordResetsCount = passwordResetsCount)
      : (this.passwordResetsCount = 0);
    rolesCount !== undefined ? (this.rolesCount = rolesCount) : (this.rolesCount = 0);
    solutionsCount !== undefined
      ? (this.solutionsCount = solutionsCount)
      : (this.solutionsCount = 0);
    usersCount !== undefined ? (this.usersCount = usersCount) : (this.usersCount = 0);
    difficulties !== undefined ? (this.difficultes = difficulties) : (this.difficultes = []);
    roles !== undefined ? (this.roles = roles) : (this.roles = []);
    releaseEnvironments !== undefined
      ? (this.releaseEnvironments = releaseEnvironments)
      : (this.releaseEnvironments = []);
    sortValues !== undefined ? (this.sortValues = sortValues) : (this.sortValues = []);
    timeFrames !== undefined ? (this.timeFrames = timeFrames) : (this.timeFrames = []);
  }
}
