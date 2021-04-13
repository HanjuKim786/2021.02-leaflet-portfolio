class ObjectClass{
    constructor(layers, options){
        this.layerGroup = undefined;
        
        if(options.renderer){
            this.renderer = options.renderer;
        }
        
        if(layers){
            this.layerGroup = L.featureGroup([layers],options);
        }
        else{
            this.layerGroup = L.featureGroup();
        }
        
        this.type="polyline";
        this.ids = [];
        if(layers instanceof Array){
            if(layers.length == 1){
                this.ids.push(this.layerGroup.getLayerId(layers[0]));
            }else{
                layers.reduce((acc, cur, i)=>{
                    this.ids.push(this.layerGroup.getLayerId(layers[i]));
                });
            }
        }
        else{
            if(layers){
                this.ids.push(this.layerGroup.getLayerId(layers));
            }
        }
    }
    
    addLayer(layer,options){
        this.layerGroup.addLayer(layer);
        this.ids.push(this.layerGroup.getLayerId(layer));
    }
    clear(){
        this.layerGroup.clearLayers();
        this.ids = [];
    }
    addPoint(pt){
    }
    applyToMap(map){
        this.layerGroup.addTo(map);
        /*
        let layers = this.layerGroup.getLayers();
        for(let i=0; i < layers.length; i++){
            layers[i].addTo(this.layerGroup);
        }
        */
    }
    update(){

    }
}

module.exports = ObjectClass