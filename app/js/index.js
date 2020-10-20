
import '../css/styles.scss';


import 'ol/ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import TileGrid from 'ol/tilegrid/TileGrid';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import {transform} from 'ol/proj';
import {Style, Fill, Stroke} from 'ol/style';
import {boundingExtent} from 'ol/extent';
import {transformExtent} from 'ol/proj';
import Overlay from 'ol/Overlay';
import MVT from 'ol/format/MVT';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Cluster from 'ol/source/Cluster';
import {Circle as CircleStyle, RegularShape, Text,Icon} from 'ol/style';
import {defaults as defaultControls} from 'ol/control.js';

import {get as getProjection} from 'ol/proj';


var key="pk.eyJ1IjoiaXZhbjEyMzQ1Njc4IiwiYSI6ImNqc2ZkOTNtMjA0emgzeXQ3N2ppMng4dXAifQ.2k-OLO6Do2AoH5GLOWt-xw"

var base = new TileLayer({
  source: new XYZ({
    url: 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token='+key,
    crossOrigin: "Anonymous"
  })
});
const map = new Map({
  target: 'mapa',
  controls: [],
  layers: [
    base
  ],
  view: new View({
    center: transform([-74.1083125,4.663437], 'EPSG:4326', 'EPSG:3857'),
    zoom: 4
  })
});



var key="pk.eyJ1IjoiaXZhbjEyMzQ1Njc4IiwiYSI6ImNqc2ZkOTNtMjA0emgzeXQ3N2ppMng4dXAifQ.2k-OLO6Do2AoH5GLOWt-xw"

  

var resolutions = [];
for (var i = 0; i <= 8; ++i) {
  resolutions.push(156543.03392804097 / Math.pow(2, i * 2));
}
// Calculation of tile urls for zoom levels 1, 3, 5, 7, 9, 11, 13, 15.
function tileUrlFunction(tileCoord) {
console.log(String(tileCoord[0] * 2 - 1))
  return (
    'http://localhost:9000/layer/{x}/{y}/{z}.pbf'
  )
    .replace('{z}', String(tileCoord[0] * 2 - 1))
    .replace('{x}', String(tileCoord[1]))
    .replace('{y}', String(tileCoord[2]))
}


/*
function tileUrlFunction_sector(tileCoord) {
  return (
    'https://geoportal.dane.gov.co/vector-tiles/capa/V2018_MGN_SECTORES/{z}/{x}/{y}.pbf'
  )
    .replace('{z}', String(tileCoord[0] * 2 - 1))
    .replace('{x}', String(tileCoord[1]))
    .replace('{y}', String(Math.pow(2, (tileCoord[0] * 2 - 1)) - tileCoord[2] - 1))
}
*/
function tileUrlFunction_sector(tileCoord) {

  return (
    'https://api.mapbox.com/v4/ivan12345678.9lr6r6hq/{z}/{x}/{y}.vector.pbf?sku=101h6wrNEIHUF&access_token=' +
    key
  )
    .replace('{z}', String(tileCoord[0] * 2 - 1))
    .replace('{x}', String(tileCoord[1]))
    .replace('{y}', String(tileCoord[2]))
}


const mz_source = new VectorTileSource({
  format: new MVT(),
  tileGrid: new TileGrid({
    extent: getProjection('EPSG:900913').getExtent(),
    resolutions: resolutions,
    tileSize: 512,
  }),
  tileUrlFunction: tileUrlFunction,
});



const mz_uso_res = new VectorTileLayer({
  source: mz_source,
  zIndex:1
});



map.addLayer(mz_uso_res);

