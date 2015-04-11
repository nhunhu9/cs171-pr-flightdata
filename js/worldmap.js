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

  this.map =  new Datamap({element: document.getElementById('worldmap')});

  this.wrangleData();

  this.updateVis();
}




WorldMap.prototype.wrangleData= function(){
  this.displayData = this.data;
}



WorldMap.prototype.updateVis = function(){
}


WorldMap.prototype.onSelectionChange= function (ranges){
}

// HELPERS






