import { describe, it, expect } from 'vitest';
import { encodeS2HilbertQuadkey, decodeHexS2HilbertQuadkey } from '../src/s2-hilbert-quadkey';

describe('encodeS2HilbertQuadkey', () => {
  it('should encode a valid S2 hilbert quadkey to hex format', () => {
    expect(encodeS2HilbertQuadkey('4/000102031011121320212223303133')).toBe('4x0123456789abcdf');
    expect(encodeS2HilbertQuadkey('4/00010203101112132021222330313')).toBe('4x0123456789abcd#3');
    expect(encodeS2HilbertQuadkey('4/0001020310111213202122233031')).toBe('4x0123456789abcd');
    expect(encodeS2HilbertQuadkey('0/0')).toBe('0x#0');
    expect(encodeS2HilbertQuadkey('1/00')).toBe('1x0');
    expect(encodeS2HilbertQuadkey('2/001')).toBe('2x0#1');
    expect(encodeS2HilbertQuadkey('3/002')).toBe('3x0#2');
    expect(encodeS2HilbertQuadkey('4/003')).toBe('4x0#3');
    expect(encodeS2HilbertQuadkey('5/333333333333333333333333333333')).toBe('5xfffffffffffffff');
    expect(encodeS2HilbertQuadkey('0/000000000000000000000000000000')).toBe('0x000000000000000');
  });

  it('should throw an error for invalid S2 hilbert quadkey type', () => {
    expect(() => encodeS2HilbertQuadkey(123 as never)).toThrow(
      'Invalid S2 hilbert quadkey type: number'
    );
    expect(() => encodeS2HilbertQuadkey(null as never)).toThrow(
      'Invalid S2 hilbert quadkey type: object'
    );
  });

  it('should throw an error for invalid S2 hilbert quadkey format', () => {
    expect(() => encodeS2HilbertQuadkey('4/')).toThrow('Invalid S2 hilbert quadkey format: 4/');
    expect(() => encodeS2HilbertQuadkey('4/abcd')).toThrow(
      'Invalid S2 hilbert quadkey format: 4/abcd'
    );
    expect(() => encodeS2HilbertQuadkey('4/12345x')).toThrow(
      'Invalid S2 hilbert quadkey format: 4/12345x'
    );
  });
});

describe('decodeHexS2HilbertQuadkey', () => {
  it('should decode a valid hex S2 hilbert quadkey to quadkey format', () => {
    expect(decodeHexS2HilbertQuadkey('4x0123456789abcdf')).toBe('4/000102031011121320212223303133');
    expect(decodeHexS2HilbertQuadkey('4x0123456789abcd#3')).toBe('4/00010203101112132021222330313');
    expect(decodeHexS2HilbertQuadkey('4x0123456789abcd')).toBe('4/0001020310111213202122233031');
    expect(decodeHexS2HilbertQuadkey('0x#0')).toBe('0/0');
    expect(decodeHexS2HilbertQuadkey('1x0')).toBe('1/00');
    expect(decodeHexS2HilbertQuadkey('2x0#1')).toBe('2/001');
    expect(decodeHexS2HilbertQuadkey('3x0#2')).toBe('3/002');
    expect(decodeHexS2HilbertQuadkey('4x0#3')).toBe('4/003');
    expect(decodeHexS2HilbertQuadkey('5xfffffffffffffff')).toBe('5/333333333333333333333333333333');
    expect(decodeHexS2HilbertQuadkey('0x000000000000000')).toBe('0/000000000000000000000000000000');
  });

  it('should throw an error for invalid hex S2 hilbert quadkey type', () => {
    expect(() => decodeHexS2HilbertQuadkey(123 as never)).toThrow(
      'Invalid hex S2 hilbert quadkey type: number'
    );
    expect(() => decodeHexS2HilbertQuadkey(null as never)).toThrow(
      'Invalid hex S2 hilbert quadkey type: object'
    );
  });

  it('should throw an error for invalid hex S2 hilbert quadkey format', () => {
    expect(() => decodeHexS2HilbertQuadkey('4x')).toThrow(
      'Invalid hex S2 hilbert quadkey format: 4x'
    );
    expect(() => decodeHexS2HilbertQuadkey('4y1b')).toThrow(
      'Invalid hex S2 hilbert quadkey format: 4y1b'
    );
    expect(() => decodeHexS2HilbertQuadkey('4x1b#5')).toThrow(
      'Invalid hex S2 hilbert quadkey format: 4x1b#5'
    );
  });
});
