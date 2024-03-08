let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
function markerSize(magnitude) {
    return magnitude * 20000; // Scale factor to visualize the magnitude
  }
  
  // Function to determine marker color based on earthquake depth
  function markerColor(depth) {
    if (depth > 90) return '#ff0000'; // Red for deep earthquakes
    else if (depth > 70) return '#ff8c00'; // Dark orange
    else if (depth > 50) return '#ffd700'; // Yellow
    else if (depth > 30) return '#9acd32'; // Yellow-green
    else if (depth > 10) return '#66cdaa'; // Aquamarine
    else return '#00ff00'; // Green for shallow earthquakes
  }
  
  // Initialize the map
  var myMap = L.map("map", {
    center: [37.09, -95.71], // Center of the US
    zoom: 5 // Zoom level to show a large portion of the US
  });
  
  // Add a tile layer to the map
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(myMap);
  
  // Fetch the earthquake GeoJSON data
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Create a GeoJSON layer with the retrieved data
      L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
          return L.circle(latlng, {
            radius: markerSize(feature.properties.mag),
            fillColor: markerColor(feature.geometry.coordinates[2]),
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          });
        },
        onEachFeature: function(feature, layer) {
          // Popup for each marker
          layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]} km</p>`);
        }
      }).addTo(myMap);
  
      // Set up the legend
      var legend = L.control({ position: "bottomright" });
      legend.onAdd = function(map) {
        var div = L.DomUtil.create("div", "info legend"),
            depths = [-10, 10, 30, 50, 70, 90],
            labels = [];
      
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + markerColor(depths[i] + 1) + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
        }
      
        return div;
      };
      legend.addTo(myMap);
    })
    .catch(err => {
      console.error('Error loading GeoJSON data', err);
    });