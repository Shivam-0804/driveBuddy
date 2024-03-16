// function routeFinder(origin, destination, callback) {
//   const directionsService = new google.maps.DirectionsService();
//   const request = {
//     origin: origin,
//     destination: destination,
//     travelMode: google.maps.TravelMode.DRIVING,
//   };
//   directionsService.route(request, function (result, status) {
//     if (status === google.maps.DirectionsStatus.OK) {
//       const path = result.routes[0].overview_path;
//       callback(path);
//     } else {
//       callback([]);
//     }
//   });
// }
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
    return {
      firstLocation: firstIntersectionLocation,
      lastLocation: lastIntersectionLocation,
    };
  } else {
    return null;
  }
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

let flocation, llocation;
let data_object = new Array();

function fetchdata(clocation, dlocation) {
  const origin = clocation;
  const destination = dlocation;
  fetchCoordinates(origin, destination, function (pathB) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          let index = 0;
          for (const item of data) {
            fetchCoordinates(item.origin, item.destination, function (pathA) {
              const intersectionLocations = isPathContained(pathA, pathB);
              if (intersectionLocations !== null) {
                let flocation, llocation, dist1, dist2, dist;
                const floationPromise = new Promise((resolve) => {
                  getReadableLocation(
                    intersectionLocations.firstLocation,
                    function (location_1) {
                      resolve(location_1);
                    }
                  );
                });

                const llocationPromise = new Promise((resolve) => {
                  getReadableLocation(
                    intersectionLocations.lastLocation,
                    function (location_2) {
                      resolve(location_2);
                    }
                  );
                });
                Promise.all([floationPromise, llocationPromise]).then(
                  (locations) => {
                    flocation = locations[0];
                    llocation = locations[1];
                    // console.log(item);
                    const d1 = new Promise((resolve) => {
                      finder(origin, flocation, function (temp1) {
                        resolve(temp1);
                      });
                    });
                    const d2 = new Promise((resolve) => {
                      finder(destination, llocation, function (temp2) {
                        resolve(temp2);
                      });
                    });
                    const d = new Promise((resolve) => {
                      finder(origin, destination, function (temp2) {
                        resolve(temp2);
                      });
                    });
                    Promise.all([d1, d2, d]).then((data) => {
                      dist1 = data[0];
                      dist2 = data[1];
                      dist = data[2];
                      data_object.push({
                        d1: dist1,
                        d2: dist2,
                        d: dist,
                        floc: flocation,
                        lloc: llocation,
                        dorigin: item.origin,
                        ddestination: item.destination,
                      });
                      document.querySelector(
                        ".main_body"
                      ).innerHTML += `<div class="data_box" value=${index}>
                      <div class="location_data">
                          <ul class="location_details">
                              <ul>
                                  <li id="ptime">Time</li>
                                  <ul>
                                      <li id="Pickup">${flocation}</li>
                                      <li id="dist"><b>${
                                        dist1.distance / 1000
                                      }km</b></li>
                                  </ul>
                              </ul>
                              <ul>
                                  <li id="dtime">Time</li>
                                  <ul>
                                      <li id="drop">${llocation}</li>
                                      <li id="dist"><b>${
                                        dist2.distance / 1000
                                      }km<b></li>
                                  </ul>
                              </ul>
                          </ul>
                      </div>
                      <div class="driver_data">
                          <ul>
                              <li><i class="fa-solid fa-user-tie"></i></li>
                              <li id="driver_name">${item.name}</li>
                          </ul>
                      </div>
                      <div class="price" id="fair_price">₹${Math.floor(
                        ((dist.distance / 1000) * 91) / 20
                      )}</div>
                      <div class="time">${dist.duration}</div>
                  </div>`;
                      index++;
                    });
                  }
                );
              }
            });
          }
          const boxes = document.querySelectorAll(".data_box");
          boxes.forEach((box) => {
            box.addEventListener("click", function () {
              console.log("dk");
            });
          });
        } else {
          console.error("Request error:", xhr.status);
        }
      }
    };
    xhr.open("POST", "data.php", true);
    xhr.send();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  fetchdata(
    localStorage.getItem("clocation"),
    localStorage.getItem("dlocation")
  );
  console.log("dom");
  // origin: "CP, New Delhi, Delhi, India",
  //     destination: "Laxmi Nagar, Block S1, Nanakpura, Shakarpur, Delhi",
  // fetchdata(
  //   "CP, New Delhi, Delhi, India",
  //   "Laxmi Nagar, Block S1, Nanakpura, Shakarpur, Delhi"
  // );
  // console.log(data_object);
});
setTimeout(() => {
  const boxes = document.querySelectorAll(".data_box");
  // console.log("Number of data boxes found:", boxes.length);
  boxes.forEach((box) => {
    box.addEventListener("click", function () {
      // console.log("data_box clicked");
      // console.log(this.getAttribute("value"));
      localStorage.setItem(
        "myObject",
        JSON.stringify(data_object[this.getAttribute("value")])
      );
      window.location.href = "map.html";
      // const retrievedObject = JSON.parse(localStorage.getItem("myObject"));
      // console.log(retrievedObject);
    });
  });
}, 1000);
