'use strict';

var map;
var service;
var infowindow;
var currentInfoWindow = null;
var marker;

// Data for the FourSquare API
var CLIENT_ID = 'DYEYVAX33FSMO55QEUBSU3OWBPHV44LPUIOOKEOTBD4XWVIM';
var CLIENT_SECRET = 'ZI11DWJ0KASGKIWOF4WT2TVYZEVVT15QUX4M2VNYOEITINMA';

// Hard-Coded 9 locations for making markers in the map

var locations = [{
    name: 'Cartola',
    lat: 40.209705,
    long: -8.420236,
    id: '4bf7100a5ec320a1325286d3'
}, {
    name: 'Jardim da Sereia',
    lat: 40.209861,
    long: -8.419238,
    id: '4c951307f7cfa1cdef04ba15'
}, {
    name: 'Psicológico na Praça',
    lat: 40.209100,
    long: -8.420177,
    id: '4e7dc84300397c8dcfe88b65'

}, {
    name: 'NS Hostel & Suites',
    lat: 40.210066,
    long: -8.418814,
    id: '524f2fa611d27f33d55208fd'
}, {
    name: 'Noites Longas',
    lat: 40.208259,
    long: -8.418168,
    id: '4c771f99947ca1cd0dab4637'
}, {
    name: 'Aqui Base Tango',
    lat: 40.208151,
    long: -8.418747,
    id: '5001ba9ae4b06407f6d277c7'
}, {
    name: 'NB Club Coimbra',
    lat: 40.208010,
    long: -8.420422,
    id: '4cfd54d2fabc2d439c33ded2'
}, {
    name: 'Café Académico',
    lat: 40.209044,
    long: -8.419471,
    id: '4c655288f07e2d7f458b9150'
}, {
    name: 'Café Tropical',
    lat: 40.209054,
    long: -8.419566,
    id: '4bae6b89f964a52012b03be3'
}];

// In case of no connection to the google Maps API this function runs
function googleError() {
    alert('Cannot estabilish connection to the Google Maps API. Please try again later');
}

// In case the google Maps API connects sucessfully, this function runs initialing the map
function googleSuccess() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 40.208131,
            lng: -8.419770
        },
        zoom: 16,
        disableDefaultUI: true
    });

    // Setting up the viewAppModel
    function viewAppModel() {
        var self = this;

        // Constructor for location data
        function Location(data) {
            this.name = data.name;
            this.lat = data.lat;
            this.long = data.long;
            this.id = data.id;
        }

        // Function to activate marker behavior when clicking
        Location.prototype.openWindow = function () {
            map.panTo(this.marker.position);
            google.maps.event.trigger(this.marker, 'click');
            if (currentInfoWindow !== null) {
                currentInfoWindow.close(map, this);
            }
            getFourSquare(this.marker);
            currentInfoWindow = this.marker.infoWindow;
        };

        // Function to call the FourSquares API. Code adapted from https://discussions.udacity.com/t/inconsistent-results-from-foursquare/39625/7

        function getFourSquare(location) {
            $.ajax({
                url: 'https://api.foursquare.com/v2/venues/' + location.id + '?client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&v=20140806',
                success: function (data) {
                    var result = data.response.venue;
                    location.address = result.location.address;
                    location.url = result.canonicalUrl;

                    // Fallback for locations that don't have rating set in FourSquare
                    if (result.rating !== undefined) {
                        location.rating = result.rating;
                    } else {
                        location.rating = 'Not Avaliable';
                    }
                    location.infoWindow.setContent('<div class="infowindow">' + '<h2>' + location.name + '</h2>' + '<p>Address: ' + location.address + '</p>' + '<p>Rating: ' + location.rating + '</p>' + '<a href="' + location.url + '">' + 'Foursquare Link' + '</a>' + '<p>Powered by Foursquare</p>');
                    location.infoWindow.open(map);
                }

            }).fail(function (error) {
                location.infoWindow.setContent('<div class="infowindow">' + '<h2>Unfortunately the FourSquare API could not be accessed at this time. Try again later!</p>' + '</div>');
                location.infoWindow.open(map);
            });
        }

        // Empty array created to hold all places that will be added with the forEach loop through the var locations above.

        self.allLocations = [];
        locations.forEach(function (location) {
            self.allLocations.push(new Location(location));
        });


        // Adding markers to map and other informations.

        self.allLocations.forEach(function (location) {


            location.marker = new google.maps.Marker({
                map: map,
                position: {
                    lat: location.lat,
                    lng: location.long
                },
                animation: google.maps.Animation.DROP,
                name: location.name,
                id: location.id
            });

            location.marker.infoWindow = new google.maps.InfoWindow({
                position: {
                    lat: location.lat,
                    lng: location.long
                }
            });

            // Adding click functionality to each marker
            location.marker.addListener('click', function toggleBounce() {
                map.panTo(location.marker.position);
                if (currentInfoWindow !== null) {
                    currentInfoWindow.close(map, this);
                }
                getFourSquare(location.marker);
                currentInfoWindow = location.marker.infoWindow;
                if (location.marker.getAnimation() !== null) {
                    location.marker.setAnimation(null);
                } else {
                    location.marker.setAnimation(google.maps.Animation.BOUNCE);
                }
                // Adding a timeout function to avoid the marker bouncing forever (only 2 secs)
                setTimeout(function () {
                    location.marker.setAnimation(null);
                }, 1400);
            });

        });


        // Implementing list view. Code adapted from http://opensoul.org/2011/06/23/live-search-with-knockoutjs/

        // Ko array that will have the filtered locations on the map. Default state when starting the app is with all locations visible
        self.filteredLocations = ko.observableArray();

        self.allLocations.forEach(function (location) {
            self.filteredLocations.push(location);
        });

        // Implementing the search and filter functionality.

        // Getting user input in the search bar

        self.userSearch = ko.observable('');

        // Using user input text to filter the observable Array - function

        self.filterLocations = function () {
            var textInput = self.userSearch().toLowerCase();

            // Remove everything from the filteredArray

            self.filteredLocations.removeAll();

            // Use the user input to filter locations by name

            self.allLocations.forEach(function (location) {
                location.marker.setMap(null);

                if (location.name.toLowerCase().indexOf(textInput) > -1) {
                    self.filteredLocations.push(location);
                }
            });

            self.filteredLocations().forEach(function (location) {
                location.marker.setMap(map);
            });
        };
    }
    ko.applyBindings(new viewAppModel());
}