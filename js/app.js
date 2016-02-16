'use strict'

// Google Maps API and Places library functions to start the map
var map;
var service;
var infowindow;

function initialize() {
    var coimbra = new google.maps.LatLng(40.209658,-8.419721);

    map = new google.maps.Map(document.getElementById('map'), {
        center: coimbra,
        zoom: 18,
        disableDefaultUI: true
    });
    
// Request for places library for nearby places of interest
    // Most of the code comes from the google Maps API documentation
    var request = {
        location: coimbra,
        radius: '400',
        types: ['store', 'café','food', 'bar']
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            var place = results[i];
            createMarker(results[i]);
        }
    }
}

// Function that receives the results of the callback function and adds the markers to the map.
function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });
}



