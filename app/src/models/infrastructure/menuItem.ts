import type { IMenuItem } from '@/interfaces/infrastructure/iMenuItem';

export class MenuItem implements IMenuItem {
  url: string;
  title: string;
  tooltip: string;
  mdiIcon: string;
  target: string;
  condition: boolean;

  constructor(
    url?: string,
    title?: string,
    tooltip?: string,
    mdiIcon?: string,
    target?: string,
    condition?: boolean,
  ) {
    url !== undefined ? (this.url = url) : (this.url = '');
    title !== undefined ? (this.title = title) : (this.title = '');
    tooltip !== undefined ? (this.tooltip = tooltip) : (this.tooltip = '');
    mdiIcon !== undefined ? (this.mdiIcon = mdiIcon) : (this.mdiIcon = '');
    target !== undefined ? (this.target = target) : (this.target = 'blank');
    condition !== undefined ? (this.condition = condition) : (this.condition = false);
  }
}
