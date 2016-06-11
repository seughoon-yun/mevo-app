var placeSearch, autocomplete, vehicleMap;
var pinImageURL = "http://i.imgur.com/Seaj29l.png";

var componentForm = {
    sublocality_level_1: 'input_address_suburb',
    postal_code: 'input_address_postcode',
    locality: 'input_address_city',
    country: 'input_address_country'
};

$(window).load(function() {

    var pinImage = new google.maps.MarkerImage(
        pinImageURL,
        null, /* size is determined at runtime */
        null, /* origin is 0,0 */
        null, /* anchor is bottom center of the scaled image */
        new google.maps.Size(30, 48)
    ); 

    vehicleMap = new google.maps.Map(document.getElementById('vehicles-map'), {
        center: {lat: -41.291251, lng: 174.786017},
        zoom: 16
    });

    var A3marker1 = new google.maps.Marker({
        map: vehicleMap,
        position: {lat: -41.291251, lng: 174.786017},
        title: "Audi A3 e-tron",
        icon: pinImage
    });

    var A3marker2 = new google.maps.Marker({
        map: vehicleMap,
        position: {lat: -41.291224, lng: 174.786025},
        title: "Audi A3 e-tron",
        icon: pinImage
    });

    var A3marker3 = new google.maps.Marker({
        map: vehicleMap,
        position: {lat: -41.291196, lng: 174.786031},
        title: "Audi A3 e-tron",
        icon: pinImage
    });

    var markers = [];
    markers.push(A3marker1);
    markers.push(A3marker2);
    markers.push(A3marker3);

    var clusterStyles = [
        {
            textColor: 'white',
            url: 'img/m1.png',
            height: 52,
            width: 53
        }
    ];

    var options = {
        imagePath: 'img/m',
        gridSize: 15,
        styles: clusterStyles
    };

    var A3info1 = new google.maps.InfoWindow({
        content: '<div class="map-info-window center-align"><img src="http://i.imgur.com/dkxB1VZ.png"/><p>Audi A3 Sportback e-tron</p><p class="bold">Coming Spring 2016</p><a class="btn disabled">Book</a></div>',
        pixelOffset: 0
    });

    A3marker1.addListener('click', function() {
        A3info1.open(vehicleMap, A3marker1);
    });

    A3marker2.addListener('click', function() {
        A3info1.open(vehicleMap, A3marker2);
    });

    A3marker3.addListener('click', function() {
        A3info1.open(vehicleMap, A3marker3);
    });

    var markerCluster = new MarkerClusterer(vehicleMap, markers, options);
});

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