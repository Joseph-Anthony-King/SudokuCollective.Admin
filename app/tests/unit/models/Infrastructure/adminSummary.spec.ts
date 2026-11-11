import { describe, expect, it } from 'vitest';
import { Difficulty } from '@/models/domain/difficulty';
import { Role } from '@/models/domain/role';
import { AdminSummary } from '@/models/infrastructure/adminSummary';
import { DropdownItem } from '@/models/infrastructure/dropdownItem';

describe('the AdminSummary model', () => {
  it('initializes counts and collections with defaults', () => {
    const summary = new AdminSummary();

    expect(summary.applicationsCount).toBe(0);
    expect(summary.difficultiesCount).toBe(0);
    expect(summary.emailConfirmationsCount).toBe(0);
    expect(summary.gamesCount).toBe(0);
    expect(summary.passwordResetsCount).toBe(0);
    expect(summary.rolesCount).toBe(0);
    expect(summary.solutionsCount).toBe(0);
    expect(summary.usersCount).toBe(0);
    expect(summary.difficulties).toEqual([]);
    expect(summary.roles).toEqual([]);
    expect(summary.releaseEnvironments).toEqual([]);
    expect(summary.sortValues).toEqual([]);
    expect(summary.timeFrames).toEqual([]);
  });

  it('initializes every property from the provided values', () => {
    const difficulties = [new Difficulty(1, 'Easy', 'Easy', 1)];
    const roles = [new Role(1, 'Admin', 1)];
    const releaseEnvironments = [new DropdownItem('Production', 1, ['apps'])];
    const sortValues = [new DropdownItem('Newest', 2, ['games'])];
    const timeFrames = [new DropdownItem('Today', 3, ['stats'])];

    const summary = new AdminSummary(
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      difficulties,
      roles,
      releaseEnvironments,
      sortValues,
      timeFrames,
    );

    expect(summary.applicationsCount).toBe(1);
    expect(summary.difficultiesCount).toBe(2);
    expect(summary.emailConfirmationsCount).toBe(3);
    expect(summary.gamesCount).toBe(4);
    expect(summary.passwordResetsCount).toBe(5);
    expect(summary.rolesCount).toBe(6);
    expect(summary.solutionsCount).toBe(7);
    expect(summary.usersCount).toBe(8);
    expect(summary.difficulties).toBe(difficulties);
    expect(summary.roles).toBe(roles);
    expect(summary.releaseEnvironments).toBe(releaseEnvironments);
    expect(summary.sortValues).toBe(sortValues);
    expect(summary.timeFrames).toBe(timeFrames);
  });

  it('preserves explicit zero counts and empty collections', () => {
    const difficulties: Difficulty[] = [];
    const roles: Role[] = [];
    const releaseEnvironments: DropdownItem[] = [];
    const sortValues: DropdownItem[] = [];
    const timeFrames: DropdownItem[] = [];

    const summary = new AdminSummary(
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      difficulties,
      roles,
      releaseEnvironments,
      sortValues,
      timeFrames,
    );

    expect(summary.applicationsCount).toBe(0);
    expect(summary.difficultiesCount).toBe(0);
    expect(summary.emailConfirmationsCount).toBe(0);
    expect(summary.gamesCount).toBe(0);
    expect(summary.passwordResetsCount).toBe(0);
    expect(summary.rolesCount).toBe(0);
    expect(summary.solutionsCount).toBe(0);
    expect(summary.usersCount).toBe(0);
    expect(summary.difficulties).toBe(difficulties);
    expect(summary.roles).toBe(roles);
    expect(summary.releaseEnvironments).toBe(releaseEnvironments);
    expect(summary.sortValues).toBe(sortValues);
    expect(summary.timeFrames).toBe(timeFrames);
  });
});