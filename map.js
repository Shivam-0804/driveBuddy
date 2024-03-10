function routeFinder(origin, destination, callback) {
  const directionsService = new google.maps.DirectionsService();
  const request = {
    origin: origin,
    destination: destination,
    travelMode: google.maps.TravelMode.DRIVING,
  };
  directionsService.route(request, function (result, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      const path = result.routes[0];
      callback(path);
    } else {
      console.error("Error finding route:", status);
      callback(null);
    }
  });
}

function isPathContained(pathA, pathB) {
  const stepsA = pathA.legs[0].steps;
  const stepsB = pathB.legs[0].steps;
  for (const stepA of stepsA) {
    let isContained = false;
    for (const stepB of stepsB) {
      if (stepsIntersect(stepA, stepB)) {
        isContained = true;
        break;
      }
    }
    if (!isContained) {
      return false;
    }
  }
  return true;
}

function stepsIntersect(step1, step2) {
  const start1 = step1.start_location;
  const end1 = step1.end_location;
  const start2 = step2.start_location;
  const end2 = step2.end_location;
  return (
    (start1.lat() === start2.lat() && start1.lng() === start2.lng()) ||
    (start1.lat() === end2.lat() && start1.lng() === end2.lng()) ||
    (end1.lat() === start2.lat() && end1.lng() === start2.lng()) ||
    (end1.lat() === end2.lat() && end1.lng() === end2.lng())
  );
}

function fetchdata() {
  const origin =
    "JAYPEE INSTITUTE OF INFORMATION TECHNOLOGY, Block A, Industrial Area, Sector 62, Noida, Uttar Pradesh, India";
  const destination = "Lakshmi Nagar, Delhi, India";
  routeFinder(origin, destination, function (pathA) {
    if (!pathA) return;
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          for (const item of data) {
            routeFinder(item.origin, item.destination, function (pathB) {
              if (!pathB) return;
              if (isPathContained(pathA, pathB)) {
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
fetchdata();
