import { describe, expect, it } from 'vitest';
import { GalleryApp } from '@/models/domain/galleryApp';

describe('the galleryApp domain model', () => {
  it('should have the expected properties', () => {
    const sut = new GalleryApp(
      1,
      'Gallery App',
      'http://localhost:8080',
      'https://github.com/example-user/gallery-app',
      'Example User',
      1,
      (new Date()).toUTCString(),
      (new Date()).toUTCString()
    );

    expect(sut.id).toBeTypeOf('number');
    expect(sut.name).toBeTypeOf('string');
    expect(sut.url).toBeTypeOf('string');
    expect(sut.sourceCodeUrl).toBeTypeOf('string');
    expect(sut.createdBy).toBeTypeOf('string');
    expect(sut.dateCreated).toBeTypeOf('object');
    expect(sut.dateUpdated).toBeTypeOf('object');
  });
  it('should have a default constructor', () => {
    const sut = new GalleryApp();

    expect(sut.id).toBeNull();
    expect(sut.name).toBeNull();
    expect(sut.url).toBeNull();
    expect(sut.sourceCodeUrl).toBeNull();
    expect(sut.createdBy).toBeNull();
    expect(sut.dateCreated).toBeNull();
    expect(sut.dateUpdated).toBeNull();
  });
  it("should accept undefined for dateCreated and dateUpdated", () => {
    const sut = new GalleryApp(
      1,
      'Gallery App',
      'http://localhost:8080',
      'https://github.com/example-user/gallery-app',
      'Example User',
      1,
      undefined,
      undefined
    );

    expect(sut.id).toBeTypeOf('number');
    expect(sut.name).toBeTypeOf('string');
    expect(sut.url).toBeTypeOf('string');
    expect(sut.sourceCodeUrl).toBeTypeOf('string');
    expect(sut.createdBy).toBeTypeOf('string');
    expect(sut.dateCreated).toBeTypeOf('object');
    expect(sut.dateUpdated).toBeTypeOf('object');
  });
});
