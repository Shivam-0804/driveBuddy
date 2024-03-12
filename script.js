var origin, destination, date;
document.addEventListener("DOMContentLoaded", function () {
  // Date updating
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  date = formattedDate;
  document.getElementById("date").value = formattedDate;

  // input options
  const input = document.getElementById("current");
  const output = document.getElementById("destination");
  const options = {
    types: ["geocode"],
    componentRestrictions: { country: "ind" },
  };

  origin = new google.maps.places.Autocomplete(input, options);
  destination = new google.maps.places.Autocomplete(output, options);
});

var login = true;
const submit = document.getElementById("search");
submit.addEventListener("click", function (event) {
  event.preventDefault();
  const current_location = document.getElementById("current").value;
  const drop_location = document.getElementById("destination").value;
  if (login && current_location !== "" && drop_location !== "") {
    localStorage.setItem("clocation", current_location);
    localStorage.setItem("dlocation", drop_location);
    window.location.href = "data.html";
  }
});
