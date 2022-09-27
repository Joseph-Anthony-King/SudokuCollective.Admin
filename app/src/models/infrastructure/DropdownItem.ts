import { IDropdownItem } from '@/interfaces/infrastructure/iDropdownItem';

export class DropdownItem implements IDropdownItem {
  label: string;
  value: number;
  appliesTo: string[];

  constructor(label?: string, value?: number, appliesTo?: string[]) {
    this.label = label ? label : '';
    this.value = value ? value : 0;
    this.appliesTo = appliesTo ? appliesTo : [];
  }
}
