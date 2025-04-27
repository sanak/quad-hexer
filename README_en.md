# quad-hexer

[![GitHub Actions Status](https://github.com/sanak/quad-hexer/actions/workflows/verify.yml/badge.svg?branch=main)](https://github.com/sanak/quad-hexer/actions/workflows/verify.yml)
[![Version](https://img.shields.io/npm/v/quad-hexer.svg)](https://www.npmjs.com/package/quad-hexer)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Overview

**quad-hexer** is a JavaScript library that losslessly compresses location coordinate encodings by approximately 50% by converting the quaternary part (base-4 expression) of geocode formats such as [Quadkey](https://learn.microsoft.com/en-us/bingmaps/articles/bing-maps-tile-system?redirectedfrom=MSDN#tile-coordinates-and-quadkeys), [S2 Hilbert Quadkey](http://s2geometry.io/devguide/s2cell_hierarchy.html), and [Spatial ID](https://github.com/spatial-id/javascript-sdk) Tilehash (Z-order curve) into a hexadecimal format starting with `x`.

When converting each quaternary digit (2 bits) into hexadecimal (4 bits), if the total number of digits (level) is odd, a `#` symbol is added as an indicator, followed by a single quaternary character (0–3).  
This mechanism preserves both prefix-matching searchability and sort order of the original quaternary representation.

Example (latitude/longitude `35.675, 139.762`):

| Geocode Type | Level | Original Value | Encoded Value |
|--------------|-------|----------------|---------------|
| Quadkey | 22 | 1330021123120010111021 | x7c25b604549 |
| Quadkey | 23 | 13300211231200101110210 | x7c25b604549#0 |
| Quadkey | 24 | 133002112312001011102101 | x7c25b6045491 |
| S2 Hilbert Quadkey | 20 | 3/00003010113313330121 | 3x00c45f7f19 |
| S2 Hilbert Quadkey | 21 | 3/000030101133133301211 | 3x00c45f7f19#1 |
| S2 Hilbert Quadkey | 22 | 3/0000301011331333012112 | 3x00c45f7f196 |
| Spatial ID Tilehash (Z-order curve) | 22 | 2441132234231121222132 | x7c25b604549 |
| Spatial ID Tilehash (Z-order curve) | 23 | 24411322342311212221321 | x7c25b604549#0 |
| Spatial ID Tilehash (Z-order curve) | 24 | 244113223423112122213212 | x7c25b6045491 |

When using Spatial ID with a nonzero F (Floor / Altitude) component, the hexadecimal encoding appends a `+` or `-` to indicate the sign, followed by the hexadecimal value of the F component after the XYZ part.

* Example: Latitude/longitude `35.675, 139.762` with altitude `100` meters at zoom level `23`
  * ZFXY format: `23/25/7450994/3303428`
  * Tilehash (Z-order curve): `24411322342311212265325`
  * Encoded value: `x7c25b604549#0+19`

## Demo

https://sanak.github.io/quad-hexer/

## Installation

```sh
npm install quad-hexer
# or
# yarn add quad-hexer
# pnpm add quad-hexer
```

## Usage

### Quadkey

```ts
import { quadHexer } from 'quad-hexer';

const hexQuadkey = quadHexer.encodeQuadkey('13300211231200101110210');
console.log(hexQuadkey);
// => x7c25b604549#0
console.log(quadHexer.decodeHexQuadkey(hexQuadkey));
// => 13300211231200101110210
```

### S2 Hilbert Quadkey

```ts
import { quadHexer } from 'quad-hexer';

const hexS2HilbertQuadkey = quadHexer.encodeS2HilbertQuadkey('3/000030101133133301211');
console.log(hexS2HilbertQuadkey);
// => 3x00c45f7f19#1
console.log(quadHexer.decodeHexS2HilbertQuadkey(hexS2HilbertQuadkey));
// => 3/000030101133133301211
```

### Spatial ID Tilehash (Z-order curve)

```ts
import { quadHexer } from 'quad-hexer';

const hexSpatialIdTileHash = quadHexer.encodeSpatialIdTilehash('24411322342311212221321');
console.log(hexSpatialIdTileHash);
// => x7c25b604549#0
console.log(quadHexer.decodeHexSpatialIdTilehash(hexSpatialIdTileHash));
// => 24411322342311212221321
```

## License

MIT License

## Contribution

Bug reports and feature requests are welcome via GitHub Issues.  
Pull requests are also highly appreciated!
