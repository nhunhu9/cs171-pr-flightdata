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

  this.arc_color_scale =  d3.scale.log()
      .range(["red", "blue", "black"]);

  this.map =  new Datamap({
    element: document.getElementById("worldmap"),
    projection: "mercator",
    arcConfig: {
      strokeColor: "#00BFFF",
      strokeWidth: 0.2,
      arcSharpness: 1.4,
      animationSpeed: 500
    }
  });

  this.wrangleData(function(d) { return d.origin.country == "China" //|| d.destination.country == "China" 
                                        && d.origin.country != d.destination.country});

  this.updateVis();
}


WorldMap.prototype.wrangleData= function(_filterFunction){
  this.displayData = this.filterAndAggregate(_filterFunction);
}

WorldMap.prototype.filterAndAggregate = function(_filter){

    var filter = _filter || function(){return true;}


    var that = this;

    var res =  this.data.filter(function(d) {
      return filter(d);
    });

    return res;

}



WorldMap.prototype.updateVis = function(){
  var that = this;

  this.arc_color_scale.domain(d3.extent(this.displayData, function(l) {
      return l.number_of_routes;
     }))


  this.displayData.forEach(function(d){
    d.options = {};
    d.options.strokeColor = that.arc_color_scale(d.number_of_routes);
   // d.options.greatArc = true;
  })

  this.map.arc(this.displayData);

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






