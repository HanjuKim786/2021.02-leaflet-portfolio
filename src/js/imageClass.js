class imageClass{
    constructor(url, latLngBounds){
        this.imageOverlay = L.imageOverlay(url, latLngBounds);
        this.type = "image";
    }
    applyToMap(map){
        this.imageOverlay.addTo(map);
    }
    getImage(){
        return this.imageOverlay;
    }
}

module.exports = imageClass;