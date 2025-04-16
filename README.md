# quad-hexer

## 概要

quad-hexer は位置座標の符号化に利用される Quadkey, S2 Key, Spatial ID (Tilehash) の4進数表現部分を16進数表現に変換することで、桁数を約半分程度に可逆圧縮するJavaScriptライブラリです。

各桁の4進数(2bit)を16進数(4bit)に変換する際、奇数桁の場合は半桁のインジケータとして `#` を追加し、続けて0〜3までの4進数文字を追加します。

## デモ

デモサイト(予定): https://sanak.github.io/quad-hexer/

## エンコード例

TODO:

## API

TODO:
