import { IRoleRequestData } from '@/interfaces/requests/iRoleRequestData';

export class RoleRequestData implements IRoleRequestData {
  id: number;
  name: string;
  roleLevel: number;

  constructor(id: number, name: string, roleLevel: number) {
    this.id = id;
    this.name = name;
    this.roleLevel = roleLevel;
  }
}
