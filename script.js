var origin, destination;

document.addEventListener("DOMContentLoaded", function () {
  // Date updating
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  document.getElementById("date").value = formattedDate;

  //input options
  const input = document.getElementById("current");
  const output = document.getElementById("destination");
  const options = {
    types: ["geocode"],
    componentRestrictions: { country: "ind" },
  };

  origin = new google.maps.places.Autocomplete(input, options);
  destination = new google.maps.places.Autocomplete(output, options);
});
