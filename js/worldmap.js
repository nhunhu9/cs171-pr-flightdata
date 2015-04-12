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

  this.zoomBehavior = d3.behavior.zoom();

 this.map =  new Datamap({
    element: document.getElementById("worldmap"),
    projection: "mercator",
    arcConfig: {
      strokeColor: "#00BFFF",
      strokeWidth: 0.2,
      arcSharpness: 1.4,
      animationSpeed: 500
    },
   zoomConfig: {
            zoomOnClick: true,
            zoomFactor: 0.9
    },
    done: function(datamap) {
       datamap.svg.call(that.zoomBehavior.on("zoom", redraw));

         function redraw() {
              datamap.svg.selectAll("g").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
         }
    }

  });

/*
    this.map = new Datamap({
    element: document.getElementById('worldmap'),
    geographyConfig: {
      dataUrl: 'data/custom_maps/ne_10m_admin_1_states_provinces/json/DEU.topo.json'
    },
    scope: 'DEU',
    fills: {
      defaultFill: '#bada55',
      someKey: '#fa0fa0'
    },
    setProjection: function(element) {
      var projection = d3.geo.mercator()
        .scale(100)
        .translate([element.offsetWidth / 2, element.offsetHeight / 2]);

       var path = d3.geo.path().projection(projection);
       return {path: path, projection: projection};
    }
  });
*/

  this.addResetZoomButton(this.parentElement);

  this.addFocusCountryButton("usa", this.parentElement);

  this.wrangleData(function(d) { return d.origin.city == "New York" //|| d.destination.country == "China" 
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
    d.options.greatArc = true;
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

WorldMap.prototype.addResetZoomButton = function(container){
    var that = this;

    var button = container.insert("button", ":first-child")
      .attr("class", "btn btn-sm btn-primary")
      .text("⇔ Reset Zoom")
      .on("click", function() {
        that.zoomBehavior.scale(1);
        that.zoomBehavior.translate([0, 0]);

        that.map.svg.selectAll("g")
          .transition().duration(400)
          .attr("transform", "translate(" + that.zoomBehavior.translate() + ")scale(" + that.zoomBehavior.scale() + ")");
      })
}


WorldMap.prototype.addFocusCountryButton = function(country, container){
    var that = this;

    var button = container.insert("button", ":first-child")
      .attr("class", "btn btn-sm btn-primary")
      .text("Focus on " + country)
      .on("click", function() {
        that.map.scope = country;
      
      })
}



// HELPERS





