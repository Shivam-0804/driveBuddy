document.addEventListener("DOMContentLoaded", function () {
  fetchdata(
    localStorage.getItem("clocation"),
    localStorage.getItem("dlocation")
  );
  // origin: "CP, New Delhi, Delhi, India",
  //     destination: "Laxmi Nagar, Block S1, Nanakpura, Shakarpur, Delhi",
  // fetchdata(
  //   "CP, New Delhi, Delhi, India",
  //   "Laxmi Nagar, Block S1, Nanakpura, Shakarpur, Delhi"
  // );
});

function routeFinder(origin, destination, callback) {
  const directionsService = new google.maps.DirectionsService();
  const request = {
    origin: origin,
    destination: destination,
    travelMode: google.maps.TravelMode.DRIVING,
  };
  directionsService.route(request, function (result, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      const path = result.routes[0].overview_path;
      callback(path);
    } else {
      callback([]);
    }
  });
}

function isPathContained(pathA, pathB) {
  let intersectionStartIndex = -1;
  let intersectionEndIndex = -1;
  let firstIntersectionLocation = {};
  let lastIntersectionLocation = {};

  for (let i = 0; i < pathA.length; i++) {
    for (let j = 0; j < pathB.length; j++) {
      if (pathA[i].lat === pathB[j].lat && pathA[i].lng === pathB[j].lng) {
        if (intersectionStartIndex === -1) {
          intersectionStartIndex = i;
          firstIntersectionLocation = pathA[i];
        }
        intersectionEndIndex = i;
        lastIntersectionLocation = pathA[i];
      }
    }
  }

  if (
    intersectionStartIndex !== -1 &&
    intersectionEndIndex !== -1 &&
    intersectionStartIndex !== intersectionEndIndex
  ) {
    getReadableLocation(firstIntersectionLocation, function (firstLocation) {
      plocation = firstLocation;
      console.log("First Intersection Location:", firstLocation);
    });
    getReadableLocation(lastIntersectionLocation, function (lastLocation) {
      dlocation = lastLocation;
      console.log("Last Intersection Location:", lastLocation);
    });

    return true;
  } else {
    return false;
  }
}

function getReadableLocation(location, callback) {
  const latlng = new google.maps.LatLng(location.lat, location.lng);
  const geocoder = new google.maps.Geocoder();

  geocoder.geocode({ location: latlng }, function (results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      if (results[0]) {
        const formattedAddress = results[0].formatted_address;
        callback(formattedAddress);
      } else {
        callback(null);
      }
    } else {
      callback(null);
    }
  });
}

function fetchCoordinates(origin, destination, callback) {
  const directionsService = new google.maps.DirectionsService();
  const request = {
    origin: origin,
    destination: destination,
    travelMode: google.maps.TravelMode.DRIVING,
  };
  directionsService.route(request, function (result, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      const path = result.routes[0].overview_path;
      const coordinates = path.map((point) => ({
        lat: point.lat(),
        lng: point.lng(),
      }));
      callback(coordinates);
    } else {
      console.error("Error fetching directions:", status);
      callback([]);
    }
  });
}

function fetchdata(clocation, dlocation) {
  const origin = clocation;
  const destination = dlocation;
  fetchCoordinates(origin, destination, function (pathB) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          for (const item of data) {
            fetchCoordinates(item.origin, item.destination, function (pathA) {
              if (isPathContained(pathA, pathB)) {
                console.log(item);
              } else if (isPathContained(pathA, pathB)) {
                console.log(item);
              }
            });
          }
        } else {
          console.error("Request error:", xhr.status);
        }
      }
    };
    xhr.open("POST", "data.php", true);
    xhr.send();
  });
}

function finder(origin, destination, callback) {
  const directionsService = new google.maps.DirectionsService();
  const request = {
    origin: origin,
    destination: destination,
    travelMode: google.maps.TravelMode.DRIVING,
  };
  directionsService.route(request, function (result, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      const user_data = {
        distance: result.routes[0].legs[0].distance.value,
        duration: result.routes[0].legs[0].duration.text,
      };
      callback(user_data);
    }
  });
}
