import { encodeQuadkey, decodeHexQuadkey } from './quadkey';

export const encodeS2HilbertQuadkey = (s2HilbertQuadkey: string): string => {
  if (!s2HilbertQuadkey || typeof s2HilbertQuadkey !== 'string') {
    throw new Error('Invalid S2 Hilbert Quadkey type: ' + typeof s2HilbertQuadkey);
  }
  const s2KeyPattern = /^([0-5]{1})\/([0-3]{1,30})$/
  if (!s2KeyPattern.test(s2HilbertQuadkey)) {
    throw new Error('Invalid S2 Hilbert Quadkey format: ' + s2HilbertQuadkey);
  }
  const matches = s2HilbertQuadkey.match(s2KeyPattern)!;
  if (!matches[1] || !matches[2]) {
    throw new Error('Invalid S2 Hilbert Quadkey format: ' + s2HilbertQuadkey);
  }
  const hexStringArray = [];
  hexStringArray.push(matches[1]);
  hexStringArray.push(encodeQuadkey(matches[2]));
  return hexStringArray.join('');
};

export const decodeHexS2HilbertQuadkey = (hexS2HilbertQuadkey: string): string => {
  if (!hexS2HilbertQuadkey || typeof hexS2HilbertQuadkey !== 'string') {
    throw new Error('Invalid hex S2 Hilbert Quadkey type: ' + typeof hexS2HilbertQuadkey);
  }
  const s2HexKeyPattern = /^([0-5]{1})(x[0-9a-f]{0,15})(?:#([0-3]))?$/;
  if (!s2HexKeyPattern.test(hexS2HilbertQuadkey)) {
    throw new Error('Invalid hex S2 Hilbert Quadkey format: ' + hexS2HilbertQuadkey);
  }
  const matches = hexS2HilbertQuadkey.match(s2HexKeyPattern)!;
  if (!matches[1] || (!matches[2] && !matches[3])) {
    throw new Error('Invalid hex S2 Hilbert Quadkey format: ' + hexS2HilbertQuadkey);
  }
  const quadStringArray = [];
  quadStringArray.push(matches[1]);
  quadStringArray.push('/')
  if (matches[2]) {
    quadStringArray.push(decodeHexQuadkey(matches[2]));
  }
  if (matches[3]) {
    quadStringArray.push(matches[3]);
  }
  return quadStringArray.join('');
};
