export const encodeQuadkey = (quadkey: string): string => {
  if (typeof quadkey !== 'string') {
    throw new Error('Invalid quadkey type: ' + typeof quadkey);
  }
  const quadkeyPattern = /^[0-3]{1,32}$/;
  if (!quadkeyPattern.test(quadkey)) {
    throw new Error('Invalid quadkey format: ' + quadkey);
  }
  const binaryString = quadkey
    .split('')
    .map((c) => parseInt(c, 4).toString(2).padStart(2, '0'))
    .join('');

  const hexStringArray = ['x'];
  const hexDigits = Math.floor(binaryString.length / 4);
  if (binaryString.length % 4 === 0) {
    hexStringArray.push(
      BigInt('0b' + binaryString)
        .toString(16)
        .padStart(hexDigits, '0')
    );
  } else {
    if (binaryString.length >= 4) {
      hexStringArray.push(
        BigInt('0b' + binaryString.slice(0, -2))
          .toString(16)
          .padStart(hexDigits, '0')
      );
    }
    hexStringArray.push('#');
    hexStringArray.push(BigInt('0b' + binaryString.slice(-2)).toString(4));
  }
  return hexStringArray.join('');
};

export const decodeHexQuadkey = (hexQuadkey: string): string => {
  if (!hexQuadkey || typeof hexQuadkey !== 'string') {
    throw new Error('Invalid hex quadkey type: ' + typeof hexQuadkey);
  }
  const hexQuadkeyPattern = /^x([0-9a-f]{0,16})(?:#([0-3]))?$/;
  if (!hexQuadkeyPattern.test(hexQuadkey)) {
    throw new Error('Invalid hex quadkey format: ' + hexQuadkey);
  }
  const matches = hexQuadkey.match(hexQuadkeyPattern)!;
  if (!matches[1] && !matches[2]) {
    throw new Error('Invalid hex quadkey format: ' + hexQuadkey);
  }
  const quadStringArray = [];
  if (matches[1]) {
    const quadDigits = matches[1].length * 2;
    quadStringArray.push(
      BigInt('0x' + matches[1])
        .toString(4)
        .padStart(quadDigits, '0')
    );
  }
  if (matches[2]) {
    quadStringArray.push(matches[2]);
  }
  return quadStringArray.join('');
};
