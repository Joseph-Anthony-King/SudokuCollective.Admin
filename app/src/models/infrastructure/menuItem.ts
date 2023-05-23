import { IMenuItem } from "@/interfaces/infrastructure/iMenuItem";

export class MenuItem implements IMenuItem {
	url: string;
	title: string;
	tooltip: string;
	mdiIcon: string;
  target: string;
  condition: boolean;
	
  constructor (url?: string, title?: string, tooltip?: string, mdiIcon?: string, target?: string, condition?: boolean) {
    this.url = url ? url : "";
    this.title = title ? title : "";
    this.tooltip = tooltip ? tooltip : "";
    this.mdiIcon = mdiIcon ? mdiIcon : "";
    this.target = target ? target : "blank";
    this.condition = condition === false ? false : true;
  }
}
