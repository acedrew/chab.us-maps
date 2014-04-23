function drawBus(bus) {
    if(bus.properties.route == "U") {
        return
    }
    var color = "#000000";
    var headings = {
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
    }
    if(bus.properties.route == "33" || bus.properties.route == "34") {
        color = "#029f5b"
    }
    var symbol = {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 3,
        rotation: heading,
        fillColor: color,
        strokeColor: color
    }
    buslocation =  new google.maps.LatLng(bus.geometry.coordinates[1], bus.geometry.coordinates[0]);
    var heading = headings[bus.properties.heading];
    if(!window.buses[bus.id]) {
        window.buses[bus.id] = new google.maps.Marker({
            position: buslocation,
            title: ("Bus #" + bus.id + ", Route #" + bus.properties.route),
            icon: symbol,
            map: map,
            properties: bus.properties
            });
    } else {
        window.buses[bus.id].setPosition(buslocation);
        var iconUpdate = window.buses[bus.id].getIcon();
        iconUpdate.rotation = heading;
        window.buses[bus.id].setIcon(iconUpdate);
    }
}
    
function killBus(bus) {
    console.log(bus);
    console.log(window.buses);
    if(window.buses[bus.id]) {
        window.buses[bus.id].setMap(null);
        window.buses[bus.id] = null;
        delete window.buses[bus.id];
    }
}
function setCurrentLocation() {
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(function(pos) {
        var me = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        if(!window.myloc) {
            window.myloc = new google.maps.Marker({
                clickable: false,
                icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
                                                                new google.maps.Size(22,22),
                                                                new google.maps.Point(0,18),
                                                                new google.maps.Point(11,11)),
                shadow: null,
                zIndex: 999,
                map: window.map // your google.maps.Map object
            });
        } else {
            window.myloc.setPosition(me);
        }
    }, function(error) {
        return;
        // ...
    });

}
function chabusInitialize(map) {
    var evntSource = new EventSource('http://api.chab.us/buses/tail')
    window.buses = {};
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "http://api.chab.us/buses", false);
    xmlHttp.send();
    var initialbuses = JSON.parse(xmlHttp.responseText).features;
    var i = initialbuses.length;
    while(i--) {
        if(initialbuses[i].properties.route != "U") {
            drawBus(initialbuses[i]);
        }
    }
    setCurrentLocation();
    
    evntSource.addEventListener('change', function (x) { 
        var json = JSON.parse(x.data);
        drawBus(json);
        setCurrentLocation();
        
    });
    evntSource.addEventListener('remove', function (x) { 
        var json = JSON.parse(x.data);
        console.log(json);
        killBus(json);
    });

}
function resizeScreen() {
    var screenSize = window.innerHeight;
    var headerHeight = document.querySelector("div.header").offsetHeight;
    document.querySelector("#home").style.height = (screenSize - headerHeight).toString() + "px";
}
document.addEventListener("DOMContentLoaded", function(event) {
    resizeScreen();
    console.log("DOM fully loaded and parsed");
});
window.onresize = resizeScreen;
