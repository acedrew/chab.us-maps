
function chabusInitialize(map) {
    var directions = {
        N: 0,
        NNE: 22.5,
        NE: 45,
        ENE: 67.5,
        E: 90,
        ESE: 112.5,
        SE: 135,
        SSE: 157.5,
        S: 180,
        SSW: 202.5,
        SW: 225,
        WSW: 247.5,
        W: 270,
        WNW: 292.5,
        NW: 315,
        NNW: 337.5
    };
    markerlocation = new google.maps.LatLng(35.0344, -85.2700);
    //var marker = new google.maps.Marker({
    //    position: markerlocation,
    //    title: "Test Marker",
    //    icon: {
    //        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    //        scale: 2
    //        },
    //    map: map
    //    });
    window.map = map;
    var buses = {};
    new EventSource('http://api.chab.us/buses/tail').addEventListener('change', function (x) { 
            var json = JSON.parse(x.data);
            var bus = json.bus;
            console.log(bus.id);
            buslocation =  new google.maps.LatLng(parseFloat(bus.lat), parseFloat(bus.lon));
            var heading = directions[bus.heading];
            if(!buses[bus.id]) {
                buses[bus.id] = new google.maps.Marker({
                    position: buslocation,
                    title: ("Bus #" + bus.id),
                    icon: {
                        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                        scale: 3,
                        rotation: heading
                    },
                    map: map
                    });
            } else {
                buses[bus.id].setPosition(buslocation);
                var iconUpdate = buses[bus.id].getIcon();
                iconUpdate.rotation = heading;
                buses[bus.id].setIcon(iconUpdate);
            }
                 
                
             });
}
