import type { IGalleryApp } from '@/interfaces/domain/iGalleryApp';

export class GalleryApp implements IGalleryApp {
  id: number | null;
  name: string | null;
  url: string | null;
  sourceCodeUrl: string | null;
  createdBy: string | null;
  userCount: number | null;
  dateCreated: Date | null;
  dateUpdated: Date | null;

  constructor(
    id?: number,
    name?: string,
    url?: string,
    sourceCodeUrl?: string,
    createdBy?: string,
    userCount?: number,
    dateCreated?: string,
    dateUpdated?: string,
  ) {
    id ? (this.id = id) : (this.id = null);
    name ? (this.name = name) : (this.name = null);
    url ? (this.url = url) : (this.url = null);
    sourceCodeUrl ? (this.sourceCodeUrl = sourceCodeUrl) : (this.sourceCodeUrl = null);
    createdBy ? (this.createdBy = createdBy) : (this.createdBy = null);
    userCount ? (this.userCount = userCount) : (this.userCount = null);
    dateCreated ? (this.dateCreated = new Date(dateCreated)) : (this.dateCreated = null);
    dateUpdated ? (this.dateUpdated = new Date(dateUpdated)) : (this.dateUpdated = null);
  }
}
