// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Perform a GET request to the query URL.
d3.json(queryUrl).then(function (data) {
  console.log(data.features);
  // Using the features array sent back in the API data, create a GeoJSON layer, and add it to the map.

  // 1.
  // Pass the features to a createFeatures() function:
  createFeatures(data.features);

});

function changeColor(feature) {

    console.log(feature)
    
    let depth = feature.geometry.coordinates[2];

    if (depth > 90) {
        return "purple";
    }
    else if (depth > 50) {
        return "blue";
    }
    else if (depth > 30) {
        return "green";
    }
    else if (depth > 10) {
        return "yellow";
    }
    else if (depth >5) {
        return "orange";
    }
    else {depth 
        return "red";
    }
}

// 2. 
function createFeatures(earthquakeData) {

  // Save the earthquake data in a variable.
  function onEachFeature(feature, layer) {

    layer.bindPopup(`<h3>${feature.properties.place}</h3>
    <hr>Magnitude: ${feature.properties.mag}
    <br>Latitude: ${feature.geometry.coordinates[1]}
    <br>Longitude: ${feature.geometry.coordinates[0]}
    <br>Depth: ${feature.geometry.coordinates[2]}`)
  }

  let earthquakes = L.geoJson(earthquakeData, {

    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: function(feature) {
      return {
        color: "white",
        weight: 0.3,
        radius: feature.properties.mag * 5,
        fillOpacity: 1,
        fillColor: changeColor(feature)
      }
    },
    onEachFeature: onEachFeature
  })

  // Pass the earthquake data to a createMap() function.
  createMap(earthquakes);
}

// 3.
// createMap() takes the earthquake data and incorporates it into the visualization:

function createMap(earthquakes) {
  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street
  };
  
  // Create a new map.
  // Edit the code to add the earthquake data to the layers.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control that contains our baseMaps.
  // Be sure to add an overlay Layer that contains the earthquake GeoJSON.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
