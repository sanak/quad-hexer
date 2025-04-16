export const encode = (quadkey: string): string => {
  if (!quadkey || typeof quadkey !== 'string') {
    throw new Error('Invalid quadkey type: ' + typeof quadkey);
  }
  if (!/^[0-3]+$/.test(quadkey)) {
    throw new Error('Invalid quadkey format: ' + quadkey);
  }
  const binaryString = quadkey
    .split('')
    .map((c) => parseInt(c, 4).toString(2).padStart(2, '0'))
    .join('');

  const hexStringArray = ['x'];
  if (binaryString.length % 4 === 0) {
    hexStringArray.push(BigInt('0b' + binaryString).toString(16));
  } else {
    if (binaryString.length >= 4) {
      hexStringArray.push(BigInt('0b' + binaryString.slice(0, -2)).toString(16));
    }
    hexStringArray.push('#');
    hexStringArray.push(BigInt('0b' + binaryString.slice(-2)).toString(4));
  }
  return hexStringArray.join('');
};

export const decode = (hexkey: string): string => {
  if (!hexkey || typeof hexkey !== 'string') {
    throw new Error('Invalid hexkey type: ' + typeof hexkey);
  }
  const hexkeyPattern = /^x([0-9a-f]*)(?:#([0-3]))?$/;
  if (!hexkeyPattern.test(hexkey)) {
    throw new Error('Invalid hexkey format: ' + hexkey);
  }
  const matches = hexkey.match(hexkeyPattern)!;
  const quadStringArray = [];
  if (matches.length >= 2 && matches[1]) {
    quadStringArray.push(BigInt('0x' + matches[1]).toString(4));
  }
  if (matches.length === 3) {
    quadStringArray.push(matches[2]);
  }
  return quadStringArray.join('');
};
