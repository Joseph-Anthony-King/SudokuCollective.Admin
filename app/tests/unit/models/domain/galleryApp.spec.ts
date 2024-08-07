import { describe, expect, expectTypeOf, it } from 'vitest';
import { GalleryApp } from '@/models/domain/galleryApp';

describe('the galleryApp domain model', () => {
  it('should have the expected properties', () => {
    expectTypeOf(GalleryApp).instance.toHaveProperty('id').toBeNumber;
    expectTypeOf(GalleryApp).instance.toHaveProperty('name').toBeString;
    expectTypeOf(GalleryApp).instance.toHaveProperty('url').toBeString;
    expectTypeOf(GalleryApp).instance.toHaveProperty('sourceCodeUrl').toBeString;
    expectTypeOf(GalleryApp).instance.toHaveProperty('createdBy').toBeString;
    expectTypeOf(GalleryApp).instance.toHaveProperty('dateCreated').toBeObject;
    expectTypeOf(GalleryApp).instance.toHaveProperty('dateUpdated').toBeObject;
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
  it('should have a constructor which accepts parameters', () => {
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
