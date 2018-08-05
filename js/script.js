google.maps.event.addDomListener(window, 'load', initmap);

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

    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

}












// end of page
