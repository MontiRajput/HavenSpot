mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 12, // starting zoom
});
console.log(listing.geometry.coordinates);
const marker1 = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h4>${listing.location}</h4><p>Exact Loacation provided after booking</p>`
    )
  )
  .addTo(map);

//Aditional styling only for 3d view not important
map.on("style.load", () => {
  // set the light preset to be in dusk mode.
  map.setConfigProperty("basemap", "lightPreset", "dusk");

  map.addSource("eraser", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [
              [
                [-0.12573446384880071, 51.53222253720682],
                [-0.12458889852425159, 51.53219470021111],
                [-0.12358091771250201, 51.53492205161518],
                [-0.12701761368793996, 51.53391996847543],
                [-0.12573446384880071, 51.53222253720682],
              ],
            ],
            type: "Polygon",
          },
        },
      ],
    },
  });

  map.addSource("model", {
    type: "geojson",
    data: {
      type: "Feature",
      properties: {
        "model-uri": "https://docs.mapbox.com/mapbox-gl-js/assets/tower.glb",
      },
      geometry: {
        coordinates: [-0.12501974, 51.5332374],
        type: "Point",
      },
    },
  });

  map.addLayer({
    id: "eraser",
    type: "clip",
    source: "eraser",
    layout: {
      "clip-layer-types": ["symbol", "model"],
    },
  });

  map.addLayer({
    id: "tower",
    type: "model",
    source: "model",
    minzoom: 15,
    layout: {
      "model-id": ["get", "model-uri"],
    },
    paint: {
      "model-opacity": 1,
      "model-rotation": [0.0, 0.0, 35.0],
      "model-scale": [0.8, 0.8, 1.2],
      "model-color-mix-intensity": 0,
      "model-cast-shadows": true,
      "model-emissive-strength": 0.8,
    },
  });
});
