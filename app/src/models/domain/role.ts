import { IRole } from '@/interfaces/domain/iRole';

export class Role implements IRole {
  id: number | null;
  name: string | null;
  roleLevel: number | null;

  constructor(id?: number, name?: string, roleLevel?: number) {
    id ? (this.id = id) : (this.id = null);
    name ? (this.name = name) : (this.name = null);
    roleLevel ? (this.roleLevel = roleLevel) : (this.roleLevel = null);
  }
}
