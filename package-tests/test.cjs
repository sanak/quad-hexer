const { quadHexer } = require('quad-hexer');

// Quadkey
console.log('---- Quadkey ----');
const hexQuadkey = quadHexer.encodeQuadkey('13300211231200101110210');
console.log(hexQuadkey);
// => x7c25b604549#0
console.log(quadHexer.decodeHexQuadkey(hexQuadkey));
// => 13300211231200101110210

// S2 Hilbert Quadkey
console.log('---- S2 Hilbert Quadkey ----');
const hexS2HilbertQuadkey = quadHexer.encodeS2HilbertQuadkey('3/000030101133133301211');
console.log(hexS2HilbertQuadkey);
// => 3x00c45f7f19#1
console.log(quadHexer.decodeHexS2HilbertQuadkey(hexS2HilbertQuadkey));
// => 3/000030101133133301211

// Spatial ID Tilehash
console.log('---- Spatial ID Tilehash ----');
const hexSpatialIdTileHash = quadHexer.encodeSpatialIdTilehash('24411322342311212221321');
console.log(hexSpatialIdTileHash);
// => x7c25b604549#0
console.log(quadHexer.decodeHexSpatialIdTilehash(hexSpatialIdTileHash));
// => 24411322342311212221321
