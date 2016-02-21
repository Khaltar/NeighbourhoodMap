'use strict';

// Google Maps API and Places library functions to start the map
var map;
var service;
var infowindow;
var marker;
var allMarkers = [{}];
// Function to initialize the map API
function initialize() {
    var coimbra = new google.maps.LatLng(40.209658,-8.419721);

    map = new google.maps.Map(document.getElementById('map'), {
        center: coimbra,
        zoom: 18,
        disableDefaultUI: true
    });
    setMarkers(map);
}

// Hard-Coded 9 locations
var locations = [['Cartola', 40.209705, -8.420236], ['Jardim da Sereia', 40.209861, -8.419238], ['Tapas', 40.208775, -8.419592],
['NS Hostel & Suites', 40.210066, -8.418814], ['Noites Longas', 40.208267, -8.418208], ['Aqui Base Tango', 40.208135, -8.418752], ['Municipal Police', 40.210256, -8.422048], ['Faculty of Psychology', 40.209561, -8.422350], ['Faculty of Architecture', 40.209513,-8.423293]];

// Function to set the markers on the map for the locations in the locations array

function setMarkers(map) {
    var len = locations.length;
    for (var i = 0; i < len ; i++) {
        var location = locations[i];
        var marker = new google.maps.Marker({
            position: {lat: location[1], lng: location[2]},
            map: map,
            title: location[0],
            animation: google.maps.Animation.DROP
        });
        allMarkers.push(marker);
    }
}


$(function() {
    function viewAppModel() {
        var self = this;
        this.locations = ko.observableArray(allMarkers);
    }
    ko.applyBindings(new viewAppModel());
});

