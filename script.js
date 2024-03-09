document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("current");
    const output =document.getElementById("destination");
    const options = {
        types: ["geocode"],
        componentRestrictions: { country: "ind" } 
    };

    const origin = new google.maps.places.Autocomplete(input, options);
    const destination =new google.maps.places.Autocomplete(output, options);
});
