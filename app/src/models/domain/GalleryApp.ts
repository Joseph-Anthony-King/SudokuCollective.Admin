import { IGalleryApp } from '@/interfaces/domain/IGalleryApp';

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
    this.id = id ? id : 0;
    this.name = name ? name : '';
    this.url = url ? url : '';
    this.sourceCodeUrl = sourceCodeUrl ? sourceCodeUrl : '';
    this.createdBy = createdBy ? createdBy : '';
    this.userCount = userCount ? userCount : 0;
    this.dateCreated = dateCreated ? new Date(dateCreated) : new Date();
    this.dateUpdated = dateUpdated ? new Date(dateUpdated) : new Date();
  }
}
