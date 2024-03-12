document.addEventListener("DOMContentLoaded", function () {
  let directionsService;
  let map;
  let directionsRenderer1;
  let directionsRenderer2;

  function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
      zoom: 15,
      center: { lat: 28.7040592, lng: 77.1024902 },
    });
    directionsService = new google.maps.DirectionsService();
    directionsRenderer1 = new google.maps.DirectionsRenderer({
      map: map,
      polylineOptions: { strokeColor: "blue" },
    });
    directionsRenderer2 = new google.maps.DirectionsRenderer({
      map: map,
      polylineOptions: { strokeColor: "red" },
    });
  }

  function plotPath(origin, destination, directionsRenderer) {
    const request = {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, function (result, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result);
      } else {
        console.error("Error plotting path:", status);
        alert("Error plotting path: " + status);
      }
    });
  }

  initMap();
  plotPath("Delhi, India", "Mumbai, Maharashtra, India", directionsRenderer1);
  plotPath(
    "Ghaziabad, Uttar Pradesh, India",
    "Delhi, India",
    directionsRenderer2
  );
});
