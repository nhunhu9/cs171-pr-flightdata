WorldMap = function(_parentElement, _data, _metaData, _eventHandler){
  
  this.parentElement = _parentElement;
  this.data = _data;
  this.metaData = _metaData;
  this.eventHandler = _eventHandler;
  this.displayData = [];

  this.initVis();
}


WorldMap.prototype.initVis = function(){

  var that = this; 

  this.map =  new Datamap({
    element: document.getElementById("worldmap"),
    projection: "mercator",
    arcConfig: {
      strokeColor: "#00BFFF",
      strokeWidth: 1,
      arcSharpness: 1.4,
      animationSpeed: 600
    }
  });

  this.wrangleData();

  this.updateVis();
}


WorldMap.prototype.wrangleData= function(_filterFunction){
  this.displayData = this.filterAndAggregate(_filterFunction);
}

WorldMap.prototype.filterAndAggregate = function(_filter){

    var filter = _filter || function(){return true;}

    var that = this;

    return this.data;

}



WorldMap.prototype.updateVis = function(){
}


WorldMap.prototype.onSelectionChange= function (ranges){
}

// HELPERS






