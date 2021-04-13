//import "../style/common.css";
require('../style/common.css');
window.$ = window.jQuery = require('jquery');
require('bootstrap');
const L = require('leaflet');
require('leaflet/dist/leaflet.css');
require('leaflet-draw');
require('leaflet-measure');
require('leaflet-measure/dist/leaflet-measure.css');
require("./leaflet/korean");
//require('../plugin/Leaflet.singleclick/singleclick');
//require('../plugin/Leaflet.LayerGroup.Collision/src/Leaflet.LayerGroup.Collision');
window.rbush = require('rbush');
var ObjectClass = require('./ObjectClass');
var PolylineClass = require('./PolylineClass');
var BusInfoClass = require('./BusInfo/BusInfoClass');
var MarkerClass = require('./MarkerClass');
const { RequestErrorEvent } = require('cesium');

class App{
    constructor(){
        this.renderer = L.canvas({
            tolerance: 1000,
            title: 'mainRenderer',
        });
        this.map = L.map('map',{
            crs: L.Proj.CRS.VWorld,
            renderer: this.renderer,
            continuousWorld: false,
            worldCopyJump: false,
            zoom: 7,
            minZoom: 6,
            maxZoom: 20,
            center: [127.03024297021332, 37.52410408047953]
        }).setView({ lng: 127.03024297021332, lat: 37.52410408047953 }, 11);
        L.tileLayer.koreaProvider('VWorld.Street',{crossOrigin: true}).addTo(this.map);

        this.objects = [];
        this.picked = null;
        
    }

    createObject(type,options){
        if(type == "polyline"){
            let layer = L.polyline([[]],{renderer: L.canvas({
                title: 'polylineRenderer',
            })});
            this.objects.push(new PolylineClass(layer, {
                renderer: this.renderer,
                pt: options.point,
                map:this.map,
            }));
        }
        else if(type == "bus"){
            this.objects.push(new BusInfoClass(undefined, {
                renderer: this.renderer
            }));
        }
        else{
            this.objects.push(new ObjectClass(undefined, {
                renderer: this.renderer,
            }));
        }

        //this.objects[this.objects.length-1].applyToMap(this.map);
        this.picked = this.objects[this.objects.length - 1];
    }
    addLayerToPicked(layer){
        this.picked.addLayer(layer);
    }
    pickedObjectClear(){
        this.picked.clear();
    }
    addPoint(pt){
        this.picked.addPoint(pt);
        this.picked.update();
    }
    addMarker(map){
        new MarkerClass(undefined,{map: map});
    }
}

global.App = App;