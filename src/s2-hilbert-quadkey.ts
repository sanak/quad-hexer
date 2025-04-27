import { encodeQuadkey, decodeHexQuadkey } from './quadkey';

export const encodeS2HilbertQuadkey = (s2HilbertQuadkey: string): string => {
  if (typeof s2HilbertQuadkey !== 'string') {
    throw new Error('Invalid S2 hilbert quadkey type: ' + typeof s2HilbertQuadkey);
  }
  const s2HilbertQuadkeyPattern = /^([0-5]{1})\/([0-3]{1,30})$/;
  if (!s2HilbertQuadkeyPattern.test(s2HilbertQuadkey)) {
    throw new Error('Invalid S2 hilbert quadkey format: ' + s2HilbertQuadkey);
  }
  const matches = s2HilbertQuadkey.match(s2HilbertQuadkeyPattern)!;
  const hexStringArray = [];
  hexStringArray.push(matches[1]);
  hexStringArray.push(encodeQuadkey(matches[2]));
  return hexStringArray.join('');
};

export const decodeHexS2HilbertQuadkey = (hexS2HilbertQuadkey: string): string => {
  if (typeof hexS2HilbertQuadkey !== 'string') {
    throw new Error('Invalid hex S2 hilbert quadkey type: ' + typeof hexS2HilbertQuadkey);
  }
  const hexS2HilbertQuadkeyPattern = /^([0-5]{1})(x[0-9a-f]{0,15}(?:#[0-3])?)$/;
  if (!hexS2HilbertQuadkeyPattern.test(hexS2HilbertQuadkey)) {
    throw new Error('Invalid hex S2 hilbert quadkey format: ' + hexS2HilbertQuadkey);
  }
  const matches = hexS2HilbertQuadkey.match(hexS2HilbertQuadkeyPattern)!;
  const quadStringArray = [];
  quadStringArray.push(matches[1]);
  quadStringArray.push('/');
  if (matches[2]) {
    try {
      quadStringArray.push(decodeHexQuadkey(matches[2]));
    } catch (error) {
      if (
        error instanceof Error &&
        error.message &&
        error.message.includes('Invalid hex quadkey format')
      ) {
        throw new Error('Invalid hex S2 hilbert quadkey format: ' + hexS2HilbertQuadkey);
      } else {
        throw error;
      }
    }
  }
  return quadStringArray.join('');
};
