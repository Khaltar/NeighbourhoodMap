'use strict';

// Google Maps API and Places library functions to start the map
var map;
var service;
var infowindow;
var marker;


// Hard-Coded 9 locations

var locations = [{
    name: 'Cartola',
    lat: 40.209705,
    long: -8.420236
}, {
    name: 'Jardim da Sereia',
    lat: 40.209861,
    long: -8.419238
}, {
    name: 'Tapas',
    lat: 40.208775,
    long: -8.419592
}, {
    name: 'NS Hostel & Suites',
    lat: 40.210066,
    long: -8.418814
}, {
    name: 'Noites Longas',
    lat: 40.208267,
    long: -8.418208
}, {
    name: 'Aqui Base Tango',
    lat: 40.208135,
    long: -8.418752
}, {
    name: 'Municipal Police',
    lat: 40.209561,
    long: -8.422350
}, {
    name: 'Faculty of Psychology',
    lat: 40.209561,
    long: -8.422350
}, {
    name: 'Faculty of Architecture',
    lat: 40.209513,
    long: -8.423293
}];




$(function() {
    function viewAppModel() {
        var self = this;
        var coimbra = new google.maps.LatLng(40.209658,-8.419721);
        
        // Function to initialize the map API
        self.map = new google.maps.Map(document.getElementById('map'), {
                center: coimbra,
                zoom: 18,
                disableDefaultUI: true
            });
        
        function Location(data) {
            this.name = data.name;
            this.lat = data.lat;
            this.long = data.long;
        }
        
        // Empty array created to hold all places that will be added with the forEach loop through the var locations above.
        
        self.allLocations = [];
        locations.forEach(function(location) {
            self.allLocations.push(new Location(location));
        });
        
        // Adding markers to map. TODO: Integrate API
        self.allLocations.forEach(function(location) {
            location.marker = new google.maps.Marker({
                map: self.map,
                position: {lat: location.lat, lng: location.long},
                animation: google.maps.Animation.DROP,
                name: location.name
            });
            location.marker.addListener('click', function toggleBounce() {
                if (location.marker.getAnimation() !== null) {
                    location.marker.setAnimation(null);
                } else {
                    location.marker.setAnimation(google.maps.Animation.BOUNCE);
                }
                // Adding a timeout function to avoid the marker bouncing forever (only 2 secs)
                setTimeout(function() {
                    location.marker.setAnimation(null);
                },2000);
            });
        });
        
        // Implementing list view
        
        // Ko array that will have the filtered locations on the map. Default state when starting the app is with all locations visible
        self.filteredLocations = ko.observableArray();
        
        self.allLocations.forEach(function(location) {
            self.filteredLocations.push(location);
        });
        
        // Implementing the search and filter functionality.
        
        // Getting user input in the search bar
        
        self.userSearch = ko.observable('');
        
        // Using user input text to filter the observable Array - function
        
        self.filterLocations = function() {
            var textInput = self.userSearch().toLowerCase();
            
            // Remove everything from the filteredArray
            
            self.filteredLocations.removeAll();
            
            // Use the user input to filter locations by name
            
            self.allLocations.forEach(function(location) {
                location.marker.setMap(null);
                
                if (location.name.toLowerCase().indexOf(textInput) > -1) {
                    self.filteredLocations.push(location);
                }
            });
            
            self.filteredLocations.forEach(function(location) {
                location.marker.setMap(self.map);
            });
        };
    }
    ko.applyBindings(new viewAppModel());
});

