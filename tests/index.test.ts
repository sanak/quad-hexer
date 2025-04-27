import { describe, it, expect } from 'vitest';
import { quadHexer } from '../src/index';

describe('quadHexer', () => {
  it('should encode and decode quadkey correctly', () => {
    const quadkey = '13300211231200101110210';
    const hexQuadkey = quadHexer.encodeQuadkey(quadkey);
    expect(hexQuadkey).toBe('x7c25b604549#0');
    expect(quadHexer.decodeHexQuadkey(hexQuadkey)).toBe(quadkey);
  });

  it('should encode and decode S2 Hilbert Quadkey correctly', () => {
    const s2HilbertQuadkey = '3/000030101133133301211';
    const hexS2HilbertQuadkey = quadHexer.encodeS2HilbertQuadkey(s2HilbertQuadkey);
    expect(hexS2HilbertQuadkey).toBe('3x00c45f7f19#1');
    expect(quadHexer.decodeHexS2HilbertQuadkey(hexS2HilbertQuadkey)).toBe(s2HilbertQuadkey);
  });

  it('should encode and decode Spatial ID Tilehash correctly', () => {
    const spatialIdTilehash = '24411322342311212221321';
    const hexSpatialIdTileHash = quadHexer.encodeSpatialIdTilehash(spatialIdTilehash);
    expect(hexSpatialIdTileHash).toBe('x7c25b604549#0');
    expect(quadHexer.decodeHexSpatialIdTilehash(hexSpatialIdTileHash)).toBe(spatialIdTilehash);
  });
});
