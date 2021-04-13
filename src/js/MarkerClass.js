const ObjectClass = require("./ObjectClass");
const markerIcon2x = require('../img/marker-icon-2x.png');
const markerIcon = require('../img/marker-icon.png');
const markerShadow = require('../img/marker-shadow.png');

class MarkerClass extends ObjectClass
{
    constructor(layers, options){
        super(layers, options);
        this.type = "marker";
        this.addMarker(options.map);
    }
    addMarker(map){
        let X = $('#stationLat').val();
        let Y = $('#stationLng').val();
        L.marker(L.latLng(parseFloat(X), parseFloat(Y)),{
            title: 'marker',
            icon: L.icon({
                iconUrl: markerIcon2x,
                iconSize: [38, 95],
                iconAnchor: [22, 94],
                popupAnchor: [-3, -76],
                shadowUrl: markerShadow,
                shadowSize: [68, 95],
                shadowAnchor: [22, 94]
            }),
        }).addTo(map);
    }
}

module.exports = MarkerClass;