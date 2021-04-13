const ObjectClass = require('./ObjectClass');
const imageClass = require('./imageClass');
const logoImage = require('../img/logo.jpg');

class PolylineClass extends ObjectClass
{
    constructor(layers, options){
        super(layers, options);
        super.applyToMap(options.map);
        this.type = "polyline";
        let layer = this.layerGroup.getLayer(this.ids[this.ids.length - 1]);
        if(options.pt){
            layer.bindPopup("<strong>경로를 아래 버튼에서 확정해주세요</strong>").openPopup([options.pt.lat, options.pt.lng]);
            this.pts = [];
            this.pts.push(options.pt);
            this.addPoint(options.pt);
        }
        //polyline이 정해진 후 이동위치를 표시해 줄 로고 이미지
        this.logo;
        this.fx = new L.PosAnimation();
        this.map;
    }

    addPoint(pt){
        this.layerGroup.getLayer(this.ids[0]).addLatLng(pt);
        this.pts.push(pt);
    }
    update(){
        super.update();
        let layer = this.layerGroup.getLayer(this.ids[this.ids.length - 1]);
        layer.openPopup();
    }
    done(){
        let layer = this.layerGroup.getLayer(this.ids[this.ids.length - 1]);
        layer.closePopup();

        let pos = this.pts[0];
        let halfsize = 0.0001;
        pos = L.Projection.LonLat.project(pos);
        pos.x -= halfsize;
        pos.y -= halfsize;
        let corner1 = Object.assign({}, pos);
        pos.x += halfsize*2;
        pos.y += halfsize*2;
        let corner2 = Object.assign({}, pos);
        
        corner1 = L.Projection.LonLat.unproject(corner1);
        corner2 = L.Projection.LonLat.unproject(corner2);

        this.logo = new imageClass(logoImage, L.latLngBounds(corner1, corner2));
    }
    applyToMap(map){
        this.map = map;
        let layer = this.layerGroup.getLayer(this.ids[0]);
        
        if(!map.hasLayer(layer)){
            layer.addTo(map);
        }

        if(this.logo){
            this.logo.applyToMap(map);
            this.pts.reverse();
            this.pts.pop();
            this.fxMove();
        }
    }

    fxMove(){
        this.fx.off();
        let pos = this.map.latLngToLayerPoint(this.pts.pop());
        //let pos = L.Projection.Mercator.project(this.pts.pop());
        //let pos = L.Projection.SphericalMercator.project(this.pts.pop());
        this.fx.run(this.logo.getImage().getElement(), L.point(pos.x, pos.y), 5);
        if(this.pts.length != 0){
            this.fx.on('end', this.fxMove, this);
        }
    }
}

module.exports = PolylineClass;