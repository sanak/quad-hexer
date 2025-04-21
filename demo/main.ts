import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Feature } from 'geojson';
import { tileMath } from 'quadkey-tilemath';
import { S2 } from 's2-geometry';
import { Space } from '@reearth/spatial-id-sdk';
import './style.css';
import { quadHexer } from '../src/index';

const levelOptions = {
  quadkey: { min: 1, max: 30, default: 23 },
  's2-hilbert-quadkey': { min: 1, max: 30, default: 21 },
  'spatial-id-tilehash': { min: 1, max: 30, default: 23 }
  // 'spatial-id-hilbert-tilehash': { min: 1, max: 30, default: 23 }
};

const map = new maplibregl.Map({
  container: 'map',
  style: 'https://tile.openstreetmap.jp/styles/maptiler-basic-ja/style.json',
  center: [139.762, 35.675],
  zoom: 19,
  minZoom: 0,
  maxZoom: 21,
  dragRotate: false,
  attributionControl: false
});

map.addControl(
  new maplibregl.NavigationControl({
    showCompass: false
  }),
  'top-right'
);

map.addControl(
  new maplibregl.ScaleControl({
    maxWidth: 200,
    unit: 'metric'
  })
);

map.addControl(
  new maplibregl.AttributionControl({
    compact: true,
    customAttribution: ''
  })
);

map.on('load', () => {
  // Initialize controls
  updateLevelOption();

  // Create code value polygon layer
  map.addSource('code-polygon', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  });
  map.addLayer({
    id: 'code-polygon-fill',
    type: 'fill',
    source: 'code-polygon',
    layout: {},
    paint: {
      'fill-color': '#0000ff',
      'fill-opacity': 0.5
    }
  });
  // Create sibling polygons layer
  map.addSource('sibling-polygons', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  });
  map.addLayer({
    id: 'sibling-polygons-line',
    type: 'line',
    source: 'sibling-polygons',
    layout: {},
    paint: {
      'line-color': '#888888',
      'line-width': 1
    }
  });

  // Set initial values
  const center = map.getCenter();
  updateCenterCoords(center.lat, center.lng);
  updateCodeValue(center.lat, center.lng);
  drawCodeAndSiblingPolygons();
});

map.on('moveend', () => {
  const center = map.getCenter();
  updateCenterCoords(center.lat, center.lng);
  updateCodeValue(center.lat, center.lng);
  drawCodeAndSiblingPolygons();
});

// Get UI elements
const typeSelect = document.querySelector<HTMLSelectElement>('select#type')!;
const levelSelect = document.querySelector<HTMLSelectElement>('select#level')!;
const codeValueInput = document.querySelector<HTMLInputElement>('input#code-value')!;
const encodedValueInput = document.querySelector<HTMLInputElement>('input#encoded-value')!;
const decodedValueInput = document.querySelector<HTMLInputElement>('input#decoded-value')!;
const centerCoordsInput = document.querySelector<HTMLInputElement>('input#center-coords')!;

const updateLevelOption = () => {
  const type = typeSelect.value;
  // const level = levelSelect.value;
  const selectedLevelOptions = levelOptions[type];
  levelSelect.innerHTML = '';
  for (let i = selectedLevelOptions.min; i <= selectedLevelOptions.max; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    levelSelect.appendChild(option);
  }
  levelSelect.value = selectedLevelOptions.default;
};

const updateCenterCoords = (lat, lng) => {
  centerCoordsInput.value = `${lat.toFixed(7)},${lng.toFixed(7)}`;
};

const updateCodeValue = (lat, lng) => {
  const type = typeSelect.value;
  const level = parseInt(levelSelect.value);
  let codeValue = '';
  let encodedValue = '';
  let decodedValue = '';
  switch (type) {
    case 'quadkey':
      codeValue = tileMath.pointToQuadkey(lng, lat, level);
      encodedValue = quadHexer.encodeQuadkey(codeValue);
      decodedValue = quadHexer.decodeHexQuadkey(encodedValue);
      break;
    case 's2-hilbert-quadkey':
      codeValue = S2.latLngToKey(lat, lng, level);
      encodedValue = quadHexer.encodeS2HilbertQuadkey(codeValue);
      decodedValue = quadHexer.decodeHexS2HilbertQuadkey(encodedValue);
      break;
    case 'spatial-id-tilehash':
      codeValue = new Space({ lng: lng, lat: lat }, level).tilehash;
      encodedValue = quadHexer.encodeSpatialIdTilehash(codeValue);
      decodedValue = quadHexer.decodeHexSpatialIdTilehash(encodedValue);
      break;
    /*
    case 'spatial-id-hilbert-tilehash':
      codeValue = new Space({ lng: lng, lat: lat }, level).hilbertTilehash;
      encodedValue = quadHexer.encodeSpatialIdTilehash(codeValue);
      decodedValue = quadHexer.decodeHexSpatialIdTilehash(encodedValue);
      break;
    */
  }
  codeValueInput.value = codeValue;
  encodedValueInput.value = encodedValue;
  decodedValueInput.value = decodedValue;
};

const drawCodeAndSiblingPolygons = () => {
  const type = typeSelect.value;
  const codeValue = codeValueInput.value;
  const coordinates: number[][] = [];
  const selectedLevelOptions = levelOptions[type];
  const level = parseInt(levelSelect.value);
  const hasSiblings = level > selectedLevelOptions.min;
  const siblingCoordinatesArray: number[][][] = [];
  const quadkeyChars = '0123';
  switch (type) {
    case 'quadkey':
      {
        const bbox = tileMath.quadkeyToBoundingBox(codeValue);
        coordinates.push(
          [bbox.west, bbox.south],
          [bbox.east, bbox.south],
          [bbox.east, bbox.north],
          [bbox.west, bbox.north],
          [bbox.west, bbox.south]
        );
        if (hasSiblings) {
          for (let i = 0; i < quadkeyChars.length; i++) {
            const siblingCode = codeValue.slice(0, -1) + quadkeyChars[i];
            if (siblingCode === codeValue) {
              continue;
            }
            const siblingBbox = tileMath.quadkeyToBoundingBox(siblingCode);
            siblingCoordinatesArray.push([
              [siblingBbox.west, siblingBbox.south],
              [siblingBbox.east, siblingBbox.south],
              [siblingBbox.east, siblingBbox.north],
              [siblingBbox.west, siblingBbox.north],
              [siblingBbox.west, siblingBbox.south]
            ]);
          }
        }
      }
      break;
    case 's2-hilbert-quadkey':
      {
        const s2cell = S2.S2Cell.FromHilbertQuadKey(codeValue);
        const corners = s2cell.getCornerLatLngs();
        coordinates.push(...corners.map((latLng) => [latLng.lng, latLng.lat]), [
          corners[0].lng,
          corners[0].lat
        ]);
        if (hasSiblings) {
          for (let i = 0; i < quadkeyChars.length; i++) {
            const siblingCode = codeValue.slice(0, -1) + quadkeyChars[i];
            if (siblingCode === codeValue) {
              continue;
            }
            const siblingS2cell = S2.S2Cell.FromHilbertQuadKey(siblingCode);
            const siblingCorners = siblingS2cell.getCornerLatLngs();
            siblingCoordinatesArray.push([
              ...siblingCorners.map((latLng) => [latLng.lng, latLng.lat]),
              [siblingCorners[0].lng, siblingCorners[0].lat]
            ]);
          }
        }
      }
      break;
    case 'spatial-id-tilehash':
      // case 'spatial-id-hilbert-tilehash':
      {
        const geoJsonCoords = new Space(codeValue).toGeoJSON().coordinates.flat();
        coordinates.push(...geoJsonCoords);
        if (hasSiblings) {
          const parent = new Space(codeValue).parent();
          const siblings = parent.children();
          for (const sibling of siblings) {
            if (sibling.id === codeValue || sibling.alt > 0) {
              continue;
            }
            siblingCoordinatesArray.push(sibling.toGeoJSON().coordinates.flat());
          }
        }
      }
      break;
  }
  map.getSource<maplibregl.GeoJSONSource>('code-polygon')?.setData({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { codeValue },
        geometry: {
          type: 'Polygon',
          coordinates: [coordinates]
        }
      }
    ]
  });
  const siblingFeatures: Array<Feature> = [];
  if (siblingCoordinatesArray.length > 0) {
    siblingFeatures.push({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'MultiPolygon',
        coordinates: [siblingCoordinatesArray]
      }
    });
  }
  map.getSource<maplibregl.GeoJSONSource>('sibling-polygons')?.setData({
    type: 'FeatureCollection',
    features: siblingFeatures
  });
};

// Set event handlers
typeSelect.addEventListener('change', () => {
  updateLevelOption();
  const center = map.getCenter();
  updateCodeValue(center.lat, center.lng);
  drawCodeAndSiblingPolygons();
});
levelSelect.addEventListener('change', () => {
  const center = map.getCenter();
  updateCodeValue(center.lat, center.lng);
  drawCodeAndSiblingPolygons();
});
