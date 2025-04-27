# quad-hexer

[![GitHub Actions Status](https://github.com/sanak/quad-hexer/actions/workflows/verify.yml/badge.svg?branch=main)](https://github.com/sanak/quad-hexer/actions/workflows/verify.yml)
[![Version](https://img.shields.io/npm/v/quad-hexer.svg)](https://www.npmjs.com/package/quad-hexer)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 概要

quad-hexer は位置座標の符号化に利用される [Quadkey](https://learn.microsoft.com/en-us/bingmaps/articles/bing-maps-tile-system?redirectedfrom=MSDN#tile-coordinates-and-quadkeys) や [S2 Cells](http://s2geometry.io/devguide/s2cell_hierarchy.html) の Hilbert Quadkey 形式、 [空間ID](https://github.com/spatial-id/javascript-sdk) の タイルハッシュ形式 (Z曲線) の4進数表現部分を、 `x` で始まる16進数表現に変換することで、桁数を約半分程度に可逆圧縮するJavaScriptライブラリです。

各桁の4進数(2bit)を16進数(4bit)に変換する際、全体の桁数(レベル)が奇数の場合は、半桁のインジケータとして `#` を追加し、続けて0〜3までの4進数文字を追加します。これにより、元の4進数表現が備える前方一致検索と、ソート時の順序を保持します。

例 (緯度・経度 `35.675, 139.762` の場合):

| ジオコード種別 | レベル | 元のコード値 | エンコード後の値 |
|--------------|-------|------------|---------------|
| Quadkey | 22 | 1330021123120010111021 | x7c25b604549 |
| Quadkey | 23 | 13300211231200101110210 | x7c25b604549#0 |
| Quadkey | 24 | 133002112312001011102101 | x7c25b6045491 |
| S2 Hilbert Quadkey | 20 | 3/00003010113313330121 | 3x00c45f7f19 |
| S2 Hilbert Quadkey | 21 | 3/000030101133133301211 | 3x00c45f7f19#1 |
| S2 Hilbert Quadkey | 22 | 3/0000301011331333012112 | 3x00c45f7f196 |
| 空間ID タイルハッシュ形式 (Z曲線) | 22 | 2441132234231121222132 | x7c25b604549 |
| 空間ID タイルハッシュ形式 (Z曲線) | 23 | 24411322342311212221321 | x7c25b604549#0 |
| 空間ID タイルハッシュ形式 (Z曲線) | 24 | 244113223423112122213212 | x7c25b6045491 |

空間IDでF(Floor、高度)成分が0でない場合は、XYZ成分を16進数にエンコードした値に続けて、正負を表す `+`/`-` と、F成分を16進数にエンコードした値を追加します。
* 例: 緯度・経度 `35.675, 139.762` で、高度 `100` m、ズームレベル `23` の場合
  * ZFXY形式: `23/25/7450994/3303428`
  * タイルハッシュ形式 (Z曲線): `24411322342311212265325`
  * エンコード後の値: `x7c25b604549#0+19`

## デモ

https://sanak.github.io/quad-hexer/

## インストール

```sh
npm install quad-hexer
# または
# yarn add quad-hexer
# pnpm add quad-hexer
```

## 使用方法

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

### 空間ID タイルハッシュ Z曲線

```ts
import { quadHexer } from 'quad-hexer';

const hexSpatialIdTileHash = quadHexer.encodeSpatialIdTilehash('24411322342311212221321');
console.log(hexSpatialIdTileHash);
// => x7c25b604549#0
console.log(quadHexer.decodeHexSpatialIdTilehash(hexSpatialIdTileHash));
// => 24411322342311212221321
```

## ライセンス

MITライセンス

## コントリビューション

バグレポートや機能リクエストは GitHub Issues にお願いします。 プルリクエストも歓迎です。
