import { IGalleryApp } from '@/interfaces/domain/iGalleryApp';

// state...
export class GalleryApp implements IGalleryApp {
  id: number;
  name: string;
  url: string;
  sourceCodeUrl: string;
  createdBy: string;
  userCount: number;
  dateCreated: Date;
  dateUpdated: Date;

  constructor(id?: number, name?: string, url?: string, sourceCodeUrl?: string, createdBy?: string, userCount?: number, dateCreated?: string, dateUpdated?: string) {
    id ? this.id = id : this.id = 0;
    name ? this.name = name : this.name = '';
    url ? this.url = url : this.url = '';
    sourceCodeUrl ? this.sourceCodeUrl = sourceCodeUrl : this.sourceCodeUrl = '';
    createdBy ? this.createdBy = createdBy : this.createdBy = '';
    userCount ? this.userCount = userCount : this.userCount = 0;
    dateCreated ? this.dateCreated = new Date(dateCreated) : this.dateCreated = new Date();
    dateUpdated ? this.dateUpdated = new Date(dateUpdated) : this.dateUpdated = new Date();
  }
}
