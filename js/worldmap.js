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

  this.wrangleData(/*function(d) { return d.origin.country == "Germany" || d.destination.country == "Germany" }*/);

  this.updateVis();
}


WorldMap.prototype.wrangleData= function(_filterFunction){
  this.displayData = this.filterAndAggregate(_filterFunction);
  debugger;
}

WorldMap.prototype.filterAndAggregate = function(_filter){

    var filter = _filter || function(){return true;}

    var that = this;

    return this.data.filter(function(d) {
      return filter(d);
    });

}



WorldMap.prototype.updateVis = function(){
  this.map.arc(this.data);

  /*this.map.arc([
    {
        origin: {
            latitude: 30.194444,
            longitude: -97.67
        },
        destination: {
            latitude: 25.793333,
            longitude: -80.290556
        },
        test: {test2: "abc"},
        options: {
          strokeWidth: 0.2,
  greatArc: true
        }
    },
    {
        origin: {
            latitude: 39.861667,
            longitude: -104.673056
        },
        destination: {
            latitude: 35.877778,
            longitude: -78.7875
        }
    }
]);*/
}


WorldMap.prototype.onSelectionChange= function (ranges){
}

// HELPERS






