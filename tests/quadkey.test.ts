import { describe, it, expect } from 'vitest';
import { encodeQuadkey, decodeHexQuadkey } from '../src/quadkey';

describe('encodeQuadkey', () => {
  it('should encode a valid quadkey to hex format', () => {
    expect(encodeQuadkey('00010203101112132021222330313233')).toBe('x0123456789abcdef');
    expect(encodeQuadkey('0001020310111213202122233031323')).toBe('x0123456789abcde#3');
    expect(encodeQuadkey('000102031011121320212223303132')).toBe('x0123456789abcde');
    expect(encodeQuadkey('0')).toBe('x#0');
    expect(encodeQuadkey('00')).toBe('x0');
    expect(encodeQuadkey('001')).toBe('x0#1');
    expect(encodeQuadkey('002')).toBe('x0#2');
    expect(encodeQuadkey('003')).toBe('x0#3');
    expect(encodeQuadkey('33333333333333333333333333333333')).toBe('xffffffffffffffff');
    expect(encodeQuadkey('00000000000000000000000000000000')).toBe('x0000000000000000');
  });

  it('should throw an error for invalid quadkey type', () => {
    expect(() => encodeQuadkey(123 as never)).toThrow('Invalid quadkey type: number');
    expect(() => encodeQuadkey(null as never)).toThrow('Invalid quadkey type: object');
  });

  it('should throw an error for invalid quadkey format', () => {
    expect(() => encodeQuadkey('')).toThrow('Invalid quadkey format: ');
    expect(() => encodeQuadkey('abcd')).toThrow('Invalid quadkey format: abcd');
    expect(() => encodeQuadkey('12345x')).toThrow('Invalid quadkey format: 12345x');
  });
});

describe('decodeHexQuadkey', () => {
  it('should decode a valid hex quadkey to quadkey format', () => {
    expect(decodeHexQuadkey('x0123456789abcdef')).toBe('00010203101112132021222330313233');
    expect(decodeHexQuadkey('x0123456789abcde#3')).toBe('0001020310111213202122233031323');
    expect(decodeHexQuadkey('x0123456789abcde')).toBe('000102031011121320212223303132');
    expect(decodeHexQuadkey('x#0')).toBe('0');
    expect(decodeHexQuadkey('x0')).toBe('00');
    expect(decodeHexQuadkey('x0#1')).toBe('001');
    expect(decodeHexQuadkey('x0#2')).toBe('002');
    expect(decodeHexQuadkey('x0#3')).toBe('003');
    expect(decodeHexQuadkey('xffffffffffffffff')).toBe('33333333333333333333333333333333');
    expect(decodeHexQuadkey('x0000000000000000')).toBe('00000000000000000000000000000000');
  });

  it('should throw an error for invalid hex quadkey type', () => {
    expect(() => decodeHexQuadkey(123 as never)).toThrow('Invalid hex quadkey type: number');
    expect(() => decodeHexQuadkey(null as never)).toThrow('Invalid hex quadkey type: object');
  });

  it('should throw an error for invalid hex quadkey format', () => {
    expect(() => decodeHexQuadkey('x')).toThrow('Invalid hex quadkey format: x');
    expect(() => decodeHexQuadkey('y1b')).toThrow('Invalid hex quadkey format: y1b');
    expect(() => decodeHexQuadkey('x1b#5')).toThrow('Invalid hex quadkey format: x1b#5');
  });
});
