const { get } = require('jquery');

ObjectClass = require('../ObjectClass');

class BusInfoClass extends ObjectClass{
    constructor(layers, options){
        super(layers, options);
        this.type = "bus";
        this.busStations = [];
        this.radius = 100;
        this._beLoaded = true;
        this.title = "businfoclass";
        this.busRenderers = [];
    }

    applyToMap(map){
    }
    isLoaded(){
        return this._beLoaded;
    }
    //ajax를 통해 공공데이터에서 정류소 위치를 받아와 map에 적용한다.
    loadBusStationsByPos(lngLat, zoom, map){
        if(this._beLoaded){
            this._beLoaded = false;
            let X = lngLat.lng;
            let Y = lngLat.lat;
            let radius = 10 * zoom;
            this.busStations = [];
            $.ajax({
                context: this,
                url: "http://localhost:8081/api/getStationByPos/"+X+"/"+Y+"/"+radius,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Access-Control-Allow-Origin","*");
                    xhr.setRequestHeader("Referrer-Policy","no-referrer");
                },
                success: function(xmldata){
                    let base = this;
                    let headerCd = $(xmldata).find('headerCd').text();

                    if(headerCd != "0"){
                        this._beLoaded = true;
                        return;
                    }

                    $(xmldata).find('itemList').each(function(index, item){
                        let lng = $(item).find("gpsX").text();
                        let lat = $(item).find("gpsY").text();
                        let stationId = $(item).find("stationId").text();
                        let stationName = $(item).find("stationNm").text();
                        base.busStations.push({
                            lng: lng,
                            lat: lat,
                            stationId: stationId,
                            stationName: stationName
                        });
                    });
                    this.applyBusStationInfoToLayerGroup(map);
                    //this.applyToMap(map);
                    this._beLoaded = true;
                }
            });
        }
    }
    createMarker(busStationInfo, map){
        let renderer = L.canvas({
            tolerance: 10,
            title: 'busRenderer',
        });
        this.busRenderers.push(renderer);
        return L.circleMarker(L.latLng(busStationInfo['lat'],busStationInfo['lng']), {
            radius: 10,
            renderer: renderer,
            interactive: true,
            bubblingMouseEvents: true,
            title: busStationInfo['stationName'],
            busStationInfo: busStationInfo,
        }).addTo(map);
    }
    applyBusStationInfoToLayerGroup(map){
        //layergroup을 초기화하고 새로운 layer 들을 추가한다.
        let len = this.layerGroup.getLayers();
        len = len.length;
        if(len > 0){
            super.clear();
        }
        if(this.busRenderers.length > 0){
            for(let i = this.busRenderers.length - 1; i >= 0; i--){
                this.busRenderers[i].remove();
            }
            this.busRenderers = [];
        }
        
        let layers = []
        if(this.busStations.length > 1){
            this.busStations.reduce((acc, cur, i)=>{
                /*
                let layer = L.circleMarker(L.latLng(cur['lat'],cur['lng']), {
                    radius: 10, 
                    renderer: L.canvas({
                        tolerance: 1000,
                        title: cur['stationName'] + 'renderer',
                    }),
                    interactive: true,
                    bubblingMouseEvents: true,
                    title: cur['stationName'],
                });
                */
               let layer = this.createMarker(cur, map);
                /*
                layer.on('click',()=>{
                    $('#busStationInfoBox').modal({
                        show:true,
                        backdrop:false,
                    });
                });
                */
                
                //super.addLayer(layer);
                //layer.options.singleClickTimeout = 250;
                layers.push(layer);
            });
            for(let i = 0; i < layers.length; i++){
                super.addLayer(layers[i]);
            }
        }
        else if( this.busStations.length == 1){
            /*
            let layer = L.circleMarker(L.latLng(this.busStations[0]['lat'],this.busStations[0]['lng']), {
                radius: 10, 
                renderer: L.canvas({
                    tolerance: 1000,
                    title: this.busStations[0]["stationName"] + "renderer",
                }),
                interactive: true,
                bubblingMouseEvents: true,
                title: this.busStations[0]["stationName"],
            });
            */
            let layer = this.createMarker(this.busStations[0], map);
            
            /*
            layer.on('click',()=>{
                $('#busStationInfoBox').modal({
                    show:true,
                    backdrop:false,
                });
            });
            */
            //layer.options.singleClickTimeout = 250;
            super.addLayer(layer);
            layers.push(layer);
        }
        
        /*
        this.layerGroup.on("click", function (event) {
            //var clickedMarker = event.layer;
            $('#busStationInfoBox').modal({
                show:true,
                backdrop:false,
            });
            $('#stationName').text(event.layer.options.title);
            $('#stationLng').val(event.latlng.lng);
            $('#stationLat').val(event.latlng.lat);
            event.originalEvent.stopPropagation();
        });
        */
        
        /*
        for(let i = 0; i < layers.length; i++){
            layers[i].on("click", function (event) {
                //var clickedMarker = event.layer;
               // L.DomEvent.stop(event);
                $('#busStationInfoBox').modal({
                    show:true,
                    backdrop:false,
                });
                $('#stationName').text(event.target.options.title);
                $('#stationLng').val(event.latlng.lng);
                $('#stationLat').val(event.latlng.lat);
                //event.originalEvent.stopPropagation();
            });
        }
        */
        
       /*
       this.layerGroup.eachLayer(function(layer){
           layer.on('click',function(){
                $('#busStationInfoBox').modal({
                    show:true,
                    backdrop:false,
                });
           })
       });
        */
    }
    displayInfo(event){
        $('#busStationInfoBox').modal({
            show:true,
            backdrop:false,
        });
        $('#stationName').text(event.target.options.title);
        $('#stationLng').val(event.latlng.lng);
        $('#stationLat').val(event.latlng.lat);
    }
    isClicked(point){
        let layers = this.layerGroup.getLayers();
        for(let i = 0; i < layers.length; i++){
            if(layers[i]._containsPoint(point)){
                return layers[i];
            }
        }
        return undefined;
    }
}

module.exports = BusInfoClass;