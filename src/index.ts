import { encodeQuadkey, decodeHexQuadkey } from './quadkey';
import { encodeS2HilbertQuadkey, decodeHexS2HilbertQuadkey } from './s2-hilbert-quadkey';
import { encodeSpatialIdTilehash, decodeHexSpatialIdTilehash } from './spatial-id-tilehash';

export const quadHexer = {
  encodeQuadkey: encodeQuadkey,
  decodeHexQuadkey: decodeHexQuadkey,
  encodeS2HilbertQuadkey: encodeS2HilbertQuadkey,
  decodeHexS2HilbertQuadkey: decodeHexS2HilbertQuadkey,
  encodeSpatialIdTilehash: encodeSpatialIdTilehash,
  decodeHexSpatialIdTilehash: decodeHexSpatialIdTilehash
};
