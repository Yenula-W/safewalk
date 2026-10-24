/**
 * Basemap shared by the hero and the app. Esri's World Dark Gray canvas is
 * free to use with attribution and needs no API key. tile.openstreetmap.org
 * started answering 429 for the deployed site, and CARTO's dark tiles now
 * require a key.
 */
export const DARK_TILES = {
  base: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
  labels: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
  attribution: 'Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors',
};
