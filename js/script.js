google.maps.event.addDomListener(window, 'load', initmap);

var map, infobox, allMarkers = [], userLocation, TransportMode = "DRIVING", directionDisplay, currentMarker;
var wellingtonStation = new google.maps.LatLng(-41.279214,174.780340);
function initmap(){

    var mapOptions = {
        center : wellingtonStation,
        zoom: 12,
        // maxZoom: 12,
        // minZoom: 10,
        disableDoubleClickZoom: true,
        disableDefaultUI: true,
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        styles: [
            {
                stylers: [
                    {hue: "#32465A"},
                    {saturation: -20}
                ]
            },
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [
                    {
                        hue: '#32465A'
                    }
                ]
            },
            {
                featureType: 'water',
                stylers : [
                    {
                        color: '#119DCB'
                    }
                ]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [
                  {
                      visibility: 'off'
                  }
              ]
            },
            {
              featureType: 'administrative',
              elementType: 'labels.text.fill',
              stylers: [
                  {
                      color: "#32465A"
                  }
              ]
            },
            {
                featureType: 'transit',
                stylers: [
                    {
                        visibility: 'off'
                    }
                ]
            },
            {
                featureType: 'poi',
                stylers: [
                    {
                        visibility: 'off'
                    }
                ]
            }
        ]
    }

    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    addAllMarkers();
    FindUser();

}

function addAllMarkers(){
    $.ajax({
        url: 'data/markers.json',
        type: 'GET',
        dataType: 'json',
        success:function(markers){
            for (var i = 0; i < markers.length; i++) {
                $("#places").append(
                    "<div class='place' data-id='"+markers[i].id+"'>"+
                        "<h3>"+markers[i].place_name+"</h3>"+
                        "<div class='panel'>"+
                            "<p>"+markers[i].description+"</p><br>"+
                            "<p>Opening Hours</p>"+
                            "<ul>"+
                                "<li>Monday: "+markers[i].openingHours.monday+"</li>"+
                                "<li>Tuesday: "+markers[i].openingHours.tuesday+"</li>"+
                                "<li>Wednesday: "+markers[i].openingHours.wednesday+"</li>"+
                                "<li>Thursday: "+markers[i].openingHours.thursday+"</li>"+
                                "<li>Friday: "+markers[i].openingHours.friday+"</li>"+
                                "<li>Saturday: "+markers[i].openingHours.saturday+"</li>"+
                                "<li>Sunday: "+markers[i].openingHours.sunday+"</li>"+
                            "</ul>"+
                        "</div>"+
                    "</div>"+
                    "<hr>"
                );

                var marker = new google.maps.Marker({
                    position: {
                        lat: markers[i].lat,
                        lng: markers[i].lng
                    },
                    title: markers[i].place_name,
                    markerID: markers[i].id,
                    monday: markers[i].openingHours.monday,
                    tuesday: markers[i].openingHours.tuesday,
                    wednesday: markers[i].openingHours.wednesday,
                    thursday: markers[i].openingHours.thursday,
                    friday: markers[i].openingHours.friday,
                    saturday: markers[i].openingHours.saturday,
                    sunday: markers[i].openingHours.sunday,
                    description: markers[i].description,
                    map: map,
                    animation: google.maps.Animation.DROP,
                    icon: 'images/PizzaIcon.png'
                });
                markerClickEvent(marker);
                allMarkers.push(marker);
            }
        },
        error:function(error){
            console.log("Error, something went wrong, can't get the markers");
            console.log(error);
        }
    });
}

function markerClickEvent(marker){
    infobox = new google.maps.InfoWindow();
    map.panTo(marker.position);
    google.maps.event.addListener(marker, 'click', function(){
        showInfoBox(marker);
    });
}

$(document).on('click', '.place', function(){
    var id = $(this).data('id');
    $('.panel').slideUp();
    $(this).find('.panel').slideDown()
    for (var i = 0; i < allMarkers.length; i++) {
        if(allMarkers[i].markerID == id){
            // map.panTo(allMarkers[i].position);
            // map.setZoom(17);
            showDirection(allMarkers[i].position, TransportMode);
            currentMarker = allMarkers[i];
            showInfoBox(allMarkers[i]);
            findPlaceInfo(allMarkers[i].title);
            break;
        }
    }
});

var service;
function findPlaceInfo(placeName){
    console.log(placeName);
    var request = {
        query: placeName +' Wellington New Zealand',
        fields: ['id', 'name', 'photos', 'formatted_address', 'rating', 'opening_hours']
    };
    service = new google.maps.places.PlacesService(map);
    service.findPlaceFromQuery(request, getPlaces);
}

function getPlaces(results, status){
    console.log(status);
    if(status == "OK"){
        for (var i = 0; i < results.length; i++) {
            console.log(results[i]);
            var photos = results[i].photos;
            console.log(photos[0].getUrl({
                'maxWidth': 300,
                'maxHeight': 300
            }));
        }
    } else {
        console.log("Something wrong with getting the places");
    }
}



function showInfoBox(marker){
    if(infobox){
        infobox.close();
    }
    infobox = new google.maps.InfoWindow();
    infobox.setContent(
        '<div class="infobox">'+
            '<strong>'+marker.title+'</strong><br>'+
            marker.description+'<br>'+
            '<ul>'+
                '<li>Monday: '+marker.monday+'</li>'+
                '<li>Tuesday: '+marker.tuesday+'</li>'+
                '<li>Wednesday: '+marker.wednesday+'</li>'+
                '<li>Thursday: '+marker.thursday+'</li>'+
                '<li>Friday: '+marker.friday+'</li>'+
                '<li>Saturday: '+marker.saturday+'</li>'+
                '<li>Sunday: '+marker.sunday+'</li>'+
            '</ul>'+
            'Monday: '+marker.monday+
        '</div>');
    infobox.open(map, marker);
}

//This will only work for secured networks
//So we are forcing our userLocation to be at the wellington Train station
function FindUser(){
    // if(navigator.geolocation){
	//     navigator.geolocation.getCurrentPosition(function(position){
    // 		userLocation = new google.maps.Marker({
    // 			position:{
    // 				lat: position.coords.latitude,
    // 				lng: position.coords.longitude
    // 			},
    // 			map: map,
    // 			animation: google.maps.Animation.DROP
    // 		});
    //         map.panTo(userLocation.position);
	//      })
    // }
	userLocation = new google.maps.Marker({
		position: wellingtonStation,
		map: map,
		animation: google.maps.Animation.DROP
	});
}

function showDirection(location, mode){
	if(directionDisplay){
		directionDisplay.setMap(null);
	}
	var directionService = new google.maps.DirectionsService();
	directionDisplay = new google.maps.DirectionsRenderer({
        polylineOptions: {
          strokeColor: "red"
        }
      });

	directionDisplay.setMap(map);

	directionService.route({
		origin: userLocation.position,
		destination: {location},
		travelMode: google.maps.TravelMode[mode],
	}, function(response, status){
		if(status == "OK"){
			directionDisplay.setDirections(response);
		} else if(status == "NOT_FOUND"){

		} else if(status == "ZERO_RESULTS"){

		}
	});
}

function changeTransport(mode){
	TransportMode = mode;
	showDirection(currentMarker.position, TransportMode);
}

// end of page
