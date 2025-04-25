import { describe, it, expect } from 'vitest';
import { encodeSpatialIdTilehash, decodeHexSpatialIdTilehash } from '../src/spatial-id-tilehash';

describe('encodeSpatialIdTilehash', () => {
  it('should encode a valid spatial id tilehash to hex format', () => {
    expect(encodeSpatialIdTilehash('111213142122232431323334414244')).toBe('x0123456789abcdf');
    expect(encodeSpatialIdTilehash('11121314212223243132333441424')).toBe('x0123456789abcd#3');
    expect(encodeSpatialIdTilehash('1112131421222324313233344142')).toBe('x0123456789abcd');
    expect(encodeSpatialIdTilehash('1')).toBe('x#0');
    expect(encodeSpatialIdTilehash('11')).toBe('x0');
    expect(encodeSpatialIdTilehash('112')).toBe('x0#1');
    expect(encodeSpatialIdTilehash('113')).toBe('x0#2');
    expect(encodeSpatialIdTilehash('114')).toBe('x0#3');
    expect(encodeSpatialIdTilehash('444444444444444444444444444444')).toBe('xfffffffffffffff');
    expect(encodeSpatialIdTilehash('111111111111111111111111111111')).toBe('x000000000000000');

    expect(encodeSpatialIdTilehash('5')).toBe('x#0+1');
    expect(encodeSpatialIdTilehash('-55')).toBe('x0-3');
    expect(encodeSpatialIdTilehash('666')).toBe('x5#1+7');
    expect(encodeSpatialIdTilehash('-777')).toBe('xa#2-7');
    expect(encodeSpatialIdTilehash('888')).toBe('xf#3+7');
    expect(encodeSpatialIdTilehash('8888888888888888888888884')).toBe('xffffffffffff#3+1fffffe');
    expect(encodeSpatialIdTilehash('-5555555555555555555555551')).toBe('x000000000000#0-1fffffe');
  });

  it('should throw an error for invalid spatial id tilehash type', () => {
    expect(() => encodeSpatialIdTilehash(123 as never)).toThrow(
      'Invalid spatial id tilehash type: number'
    );
    expect(() => encodeSpatialIdTilehash(null as never)).toThrow(
      'Invalid spatial id tilehash type: object'
    );
  });

  it('should throw an error for invalid spatial id tilehash format', () => {
    expect(() => encodeSpatialIdTilehash('')).toThrow('Invalid spatial id tilehash format: ');
    expect(() => encodeSpatialIdTilehash('abcd')).toThrow(
      'Invalid spatial id tilehash format: abcd'
    );
    expect(() => encodeSpatialIdTilehash('12345x')).toThrow(
      'Invalid spatial id tilehash format: 12345x'
    );
    expect(() => encodeSpatialIdTilehash('+1234')).toThrow(
      'Invalid spatial id tilehash format: +1234'
    );
  });
});

describe('decodeHexSpatialIdTilehash', () => {
  it('should decode a valid hex spatial id tilehash to quadkey format', () => {
    expect(decodeHexSpatialIdTilehash('x0123456789abcdf')).toBe('111213142122232431323334414244');
    expect(decodeHexSpatialIdTilehash('x0123456789abcd#3')).toBe('11121314212223243132333441424');
    expect(decodeHexSpatialIdTilehash('x0123456789abcd')).toBe('1112131421222324313233344142');
    expect(decodeHexSpatialIdTilehash('x#0')).toBe('1');
    expect(decodeHexSpatialIdTilehash('x0')).toBe('11');
    expect(decodeHexSpatialIdTilehash('x0#1')).toBe('112');
    expect(decodeHexSpatialIdTilehash('x0#2')).toBe('113');
    expect(decodeHexSpatialIdTilehash('x0#3')).toBe('114');
    expect(decodeHexSpatialIdTilehash('xfffffffffffffff')).toBe('444444444444444444444444444444');
    expect(decodeHexSpatialIdTilehash('x000000000000000')).toBe('111111111111111111111111111111');

    expect(decodeHexSpatialIdTilehash('x#0+1')).toBe('5');
    expect(decodeHexSpatialIdTilehash('x0-3')).toBe('-55');
    expect(decodeHexSpatialIdTilehash('x5#1+7')).toBe('666');
    expect(decodeHexSpatialIdTilehash('xa#2-7')).toBe('-777');
    expect(decodeHexSpatialIdTilehash('xf#3+7')).toBe('888');
    expect(decodeHexSpatialIdTilehash('xfffffffffffffff')).toBe('444444444444444444444444444444');
    expect(decodeHexSpatialIdTilehash('x000000000000000')).toBe('111111111111111111111111111111');
  });

  it('should throw an error for invalid hex spatial id tilehash type', () => {
    expect(() => decodeHexSpatialIdTilehash(123 as never)).toThrow(
      'Invalid hex spatial id tilehash type: number'
    );
    expect(() => decodeHexSpatialIdTilehash(null as never)).toThrow(
      'Invalid hex spatial id tilehash type: object'
    );
  });

  it('should throw an error for invalid hex spatial id tilehash format', () => {
    expect(() => decodeHexSpatialIdTilehash('x')).toThrow(
      'Invalid hex spatial id tilehash format: x'
    );
    expect(() => decodeHexSpatialIdTilehash('y1b')).toThrow(
      'Invalid hex spatial id tilehash format: y1b'
    );
    expect(() => decodeHexSpatialIdTilehash('x1b#5')).toThrow(
      'Invalid hex spatial id tilehash format: x1b#5'
    );
    expect(() => decodeHexSpatialIdTilehash('x1b#3 7')).toThrow(
      'Invalid hex spatial id tilehash format: x1b#3 7'
    );
  });
});
