import type { IDropdownItem } from '@/interfaces/infrastructure/iDropdownItem';

export class DropdownItem implements IDropdownItem {
  label: string;
  value: number;
  appliesTo: string[];

  constructor(label?: string, value?: number, appliesTo?: string[]) {
    label !== undefined ? (this.label = label) : (this.label = '');
    value !== undefined ? (this.value = value) : (this.value = 0);
    appliesTo !== undefined ? (this.appliesTo = appliesTo) : (this.appliesTo = []);
  }
}
