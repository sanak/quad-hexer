import { encodeQuadkey, decodeHexQuadkey } from './quadkey';

export const encodeSpatialIdTilehash = (spatialIdTilehash: string): string => {
  if (!spatialIdTilehash || typeof spatialIdTilehash !== 'string') {
    throw new Error('Invalid Spatial ID Tilehash type: ' + typeof spatialIdTilehash);
  }
  const spatialIdTilehashPattern = /^(-?)([1-8]{1,30})$/;
  if (!spatialIdTilehashPattern.test(spatialIdTilehash)) {
    throw new Error('Invalid Spatial ID Tilehash format: ' + spatialIdTilehash);
  }
  const matches = spatialIdTilehash.match(spatialIdTilehashPattern)!;
  const isNegative = matches[1] === '-';
  const tilehash = matches[2];
  const octalString = tilehash
    .split('')
    .map((c) => (parseInt(c) - 1).toString())
    .join('');
  const octalDigits = octalString.length;
  const tilehashNumber = BigInt('0o' + octalString);
  const binaryString = tilehashNumber.toString(2).padStart(octalDigits * 3, '0');
  const fBinaryArray = [];
  const yxBinaryArray = [];
  for (let i = 0; i < octalDigits * 3; i += 3) {
    fBinaryArray.push(binaryString.slice(i, i + 1));
    yxBinaryArray.push(binaryString.slice(i + 1, i + 3));
  }
  const fBinaryString = fBinaryArray.join('');
  const yxBinaryString = yxBinaryArray.join('');
  const floorNumber = parseInt(fBinaryString, 2);
  const yxNumber = BigInt('0b' + yxBinaryString);
  const quadkey = yxNumber.toString(4).padStart(octalDigits, '0');
  const hexStringArray = [];
  hexStringArray.push(encodeQuadkey(quadkey));
  if (floorNumber !== 0) {
    hexStringArray.push(isNegative ? '-' : '+');
    hexStringArray.push(floorNumber.toString(10));
  }
  return hexStringArray.join('');
};

export const decodeHexSpatialIdTilehash = (hexSpatialIdTilehash: string): string => {
  if (!hexSpatialIdTilehash || typeof hexSpatialIdTilehash !== 'string') {
    throw new Error('Invalid hex Spatial ID Tilehash type: ' + typeof hexSpatialIdTilehash);
  }
  const hexSpatialIdTilehashPattern = /^(x[0-9a-f]{0,15}(?:#[0-3])?)(?:([+-]\d+))?$/;
  if (!hexSpatialIdTilehashPattern.test(hexSpatialIdTilehash)) {
    throw new Error('Invalid hex Spatial ID Tilehash format: ' + hexSpatialIdTilehash);
  }
  const matches = hexSpatialIdTilehash.match(hexSpatialIdTilehashPattern)!;
  if (!matches[1]) {
    throw new Error('Invalid hex Spatial ID Tilehash format: ' + hexSpatialIdTilehash);
  }
  const quadString = decodeHexQuadkey(matches[1]);
  const floorNumber = matches[2] ? parseInt(matches[2], 10) : 0;
  const quadDigits = quadString.length;
  const fBinaryString = Math.abs(floorNumber).toString(2).padStart(quadDigits, '0');
  const binaryStringArray = [];
  for (let i = 0; i < quadDigits; i++) {
    binaryStringArray.push(fBinaryString.slice(i, i + 1));
    binaryStringArray.push(parseInt(quadString[i], 4).toString(2).padStart(2, '0'));
  }
  const binaryString = binaryStringArray.join('');
  const octalString = BigInt('0b' + binaryString)
    .toString(8)
    .padStart(quadDigits, '0');
  const incrementedOctalString = octalString
    .split('')
    .map((c) => (parseInt(c) + 1).toString())
    .join('');
  const isNegative = floorNumber < 0;
  const tilehashStringArray = [];
  if (isNegative) {
    tilehashStringArray.push('-');
  }
  tilehashStringArray.push(incrementedOctalString);
  return tilehashStringArray.join('');
};

// export const encodeSpatialIdHilbertTilehash = (spatialIdHilbertTilehash: string): string => {
//   return `not implemented: ${spatialIdHilbertTilehash}`;
// };

// export const decodeHexSpatialIdHilbertTilehash = (hexSpatialIdHilbertTilehash: string): string => {
//   return `not implemented: ${hexSpatialIdHilbertTilehash}`;
// };
