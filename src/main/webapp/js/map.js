var placeSearch, autocomplete;
var componentForm = {
    sublocality_level_1: 'input_address_suburb',
    postal_code: 'input_address_postcode',
    locality: 'input_address_city',
    country: 'input_address_country'
};

function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete((document.getElementById('autocomplete')),{types: ['geocode']});

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();

    $('input.address').val("");
    $('input.address').prop("disabled", false);
    $('#autocomplete').val("");
    
    $('#input_address_line1').val(place.name);
    $('#input_address_line1').keyup();

    // Get each component of the address from the place details
    // and fill the corresponding field on the form.
    for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
            var inputID = componentForm[addressType];
            var input = $('#' + inputID);
            var value = place.address_components[i][input.data('gmaps-format')];
            input.val(value);
        }
    }
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
        });
    }
}