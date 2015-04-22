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
      .range(["red", "blue", "black"])
      .domain(d3.extent(this.data, function(l) {
        return l.number_of_routes;
      }))

  this.zoomBehavior = d3.behavior.zoom();

 this.map =  new Datamap({
    element: document.getElementById("worldmap"),
    projection: "mercator",
    arcConfig: {
      strokeColor: "#00BFFF",
      strokeWidth: 0.2,
      arcSharpness: 0.5,
      animationSpeed: 500
    },
   zoomConfig: {
            zoomOnClick: true,
            zoomFactor: 0.9,
            onlyWorldMap: true
    },
    done: function(datamap) {
      // Pan & Zoom
      datamap.svg.call(that.zoomBehavior.on("zoom", redraw));

      function redraw() {
        datamap.svg.selectAll("g").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
      }
    },
    subunitClick: function(g) {
      that.wrangleData(null);
      that.updateVis();               
    }, 
    subunitClicked: function(g) {
      that.map.updateScope(g.id);

      that.zoomBehavior.scale(1).translate([0, 0]);  
      that.map.resetZoom(0); 

      d3.select("#addBackToWorldButton").attr("style", "");

      that.map.svg.selectAll("g")
        .style("opacity", 0)
        .transition()
        .duration(750)
        .delay(300)
        .style("opacity", 1)
        .call(that.map.endAll, function () {

          that.wrangleData(function(d) { return d.origin.country == g.properties.name  && d.origin.country == d.destination.country});
          that.updateVis();    
          that.map.options.done(that.map);
        });
  

    },
   subunitMouseover: function(g) {
        if (that.map.options.scope != "world")
            return;

        that.wrangleData(function(d) { return d.origin.country == g.properties.name 
                                        && d.origin.country != d.destination.country});
        that.updateVis();      
    },
    subunitMouseout: function() {
      if (that.map.options.scope != "world")
          return;

      //TODO: set a default filter 
    } 
  });

/* Custom Map
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
  this.addBackToWorldButton(this.parentElement);

  //this.addFocusCountryButton("usa", this.parentElement);

  this.wrangleData(function(d) { return d.origin.city == "New York" //|| d.destination.country == "China" 
                                        && d.origin.country != d.destination.country});

  this.updateVis();
}


WorldMap.prototype.wrangleData= function(_filterFunction){
  this.displayData = this.filterAndAggregate(_filterFunction);
}

WorldMap.prototype.filterAndAggregate = function(_filter){

    var filter = _filter || function(){return false;}


    var that = this;

    var res =  this.data.filter(function(d) {
      return filter(d);
    });

    return res;

}



WorldMap.prototype.updateVis = function(){
  var that = this;

  this.displayData.forEach(function(d){
    d.options = {};
    d.options.strokeColor = that.arc_color_scale(d.number_of_routes);
    d.options.greatArc = true;
  })

  this.map.arc(this.displayData);
}


WorldMap.prototype.onSelectionChange= function (ranges){
}

WorldMap.prototype.addResetZoomButton = function(container){
    var that = this;

    var button = container.insert("button", ":first-child")
      .attr("class", "btn btn-sm btn-primary")
      .text("⇔ Reset Zoom")
      .on("click", function() { 
        that.zoomBehavior.scale(1).translate([0, 0]);  
        that.map.resetZoom();
      })
}


WorldMap.prototype.addBackToWorldButton = function(container){
    var that = this;

    var button = container.insert("button", ":first-child")
      .attr("id", "addBackToWorldButton")
      .attr("class", "btn btn-sm btn-primary")
      .attr("style", "display: none")
      .on("click", function() { 
        var button = d3.select(this);

        that.map.svg.selectAll("g")
          .transition()
          .duration(750)
          .style("opacity", 0)
          .call(that.map.endAll, function () {
            button.attr("style", "display: none");

            that.map.updateScope("world");
            that.zoomBehavior.scale(1).translate([0, 0]);  
            that.map.resetZoom();

            that.wrangleData(null);
            that.updateVis(); 


            that.map.svg.selectAll("g")
              .transition()
              .duration(750)
              .delay(750)
              .style("opacity", 1)
              .call(that.map.endAll, function () {
                //TODO: set a default filter 
                that.map.options.done(that.map);
              });
          });

      })


      button.text("↩ To World Map");
}

// HELPERS





