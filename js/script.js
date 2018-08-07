google.maps.event.addDomListener(window, 'load', initmap);

var map, infobox, allMarkers = [];

function initmap(){

    var mapOptions = {
        center :{
            lat: -41.279214,
            lng: 174.780340
        },
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

    // // Adding one single marker onto our map
    // var myLatlng = new google.maps.LatLng(-41.279214,174.780340);
    // var marker = new google.maps.Marker({
    //     position: myLatlng,
    //     title:"Hello World!"
    // });
    //
    // marker.setMap(map);

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

                // // If we want our markers to drop 1 at a time. Need to remove the var marker code bellow
                // addMarkerWithTimeout(markers[i], i * 400);

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
            // // If we want our markers to drop 1 at a time

            // function addMarkerWithTimeout(marker, timeout) {
            //   window.setTimeout(function() {
            //     markers.push(new google.maps.Marker({
            //       position: {
            //           lat: marker.lat,
            //           lng: marker.lng
            //       },
            //       title: marker.place_name,
            //       map: map,
            //       animation: google.maps.Animation.DROP,
            //       icon: 'images/PizzaIcon.png'
            //     }));
            //   }, timeout);
            // }
        },
        error:function(error){
            console.log("Error, something went wrong, can't get the markers");
            console.log(error);
        }
    });
}

function markerClickEvent(marker){
    if(infobox){
        infobox.close();
    }
    infobox = new google.maps.InfoWindow();
    map.panTo(marker.position);
    google.maps.event.addListener(marker, 'click', function(){
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
    });
}

function moveMap(){
    var latlng = new google.maps.LatLng(-41.2959299, 174.772154);
    map.panTo(latlng);
    map.setZoom(17);
}


$(document).on('click', '.place', function(){
    if(infobox){
        infobox.close();
    }
    var id = $(this).data('id');
    $('.panel').slideUp();
    $(this).find('.panel').slideDown()
    for (var i = 0; i < allMarkers.length; i++) {
        if(allMarkers[i].markerID == id){
            map.panTo(allMarkers[i].position);
            map.setZoom(17);
            infobox = new google.maps.InfoWindow();
            infobox.setContent(
                '<div class="infobox">'+
                    '<strong>'+allMarkers[i].title+'</strong><br>'+
                    allMarkers[i].description+'<br>'+
                    '<ul>'+
                        '<li>Monday: '+allMarkers[i].monday+'</li>'+
                        '<li>Tuesday: '+allMarkers[i].tuesday+'</li>'+
                        '<li>Wednesday: '+allMarkers[i].wednesday+'</li>'+
                        '<li>Thursday: '+allMarkers[i].thursday+'</li>'+
                        '<li>Friday: '+allMarkers[i].friday+'</li>'+
                        '<li>Saturday: '+allMarkers[i].saturday+'</li>'+
                        '<li>Sunday: '+allMarkers[i].sunday+'</li>'+
                    '</ul>'+
                    'Monday: '+allMarkers[i].monday+
                '</div>');
            infobox.open(map, allMarkers[i]);
            break;
        }
    }
});







// end of page
