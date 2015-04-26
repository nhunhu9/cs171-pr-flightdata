//Based on template from http://jsfiddle.net/PcjUR/116/

BarChart = function(_parentElement, _data, _eventHandler){
  
  this.parentElement = _parentElement;
  this.data = _data;
  this.eventHandler = _eventHandler;
  this.displayData = [];
  this.circle = [];

  this.initVis();
}


BarChart.prototype.initVis = function(){

  var that = this; 

  var margin = {
      top: 10,
      right: 30,
      bottom: 10,
      left: 80
  };
  this.width = width = 300 - margin.left - margin.right;
  this.height = height = 200 - margin.top - margin.bottom;

  this.svg = this.parentElement.append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


 this.titleElement = this.svg.insert("text", ":first-child")
    .attr("class", "title")
    .attr("transform", "translate(" + -margin.left + ",0)");
  
  this.wrangleData(function(d) { return d.origin.country != d.destination.country; }, function(a,b) {return b.number_of_passengers[2010]-a.number_of_passengers[2010]; },function(d) { return d.destination.country; }, "Top Flight Destinations");
  
  this.updateVis(true);

}

// level: default: city, alternative: country
BarChart.prototype.wrangleData= function(_filterFunction, _sort, _label, _title){

  that = this;

  this.title = _title;

  this.displayData = this.filterAndAggregate(_filterFunction, _sort).map(function (d) {
      var i = Math.floor(Math.random() * 1) //color
      return {
          label: _label(d),
          value: d.number_of_routes
      };

  });

}

BarChart.prototype.filterAndAggregate = function(_filter, _sort){
    return [{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"Taiwan","longitude":121,"latitude":23.5},"number_of_routes":165},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"Japan","longitude":138,"latitude":36},"number_of_routes":146},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"South Korea","longitude":127.5,"latitude":37},"number_of_routes":120},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"Hong Kong","longitude":114.17,"latitude":22.25},"number_of_routes":107},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"United States","longitude":-97,"latitude":38},"number_of_routes":49},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"Thailand","longitude":100,"latitude":15},"number_of_routes":42},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"Macau","longitude":113.55,"latitude":22.17},"number_of_routes":37},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"Singapore","longitude":103.8,"latitude":1.37},"number_of_routes":37},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"Russia","longitude":100,"latitude":60},"number_of_routes":34},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"Malaysia","longitude":112.5,"latitude":2.5},"number_of_routes":22},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"Philippines","longitude":122,"latitude":13},"number_of_routes":19},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"Germany","longitude":9,"latitude":51},"number_of_routes":17},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"Australia","longitude":133,"latitude":-27},"number_of_routes":16},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"Vietnam","longitude":107.83,"latitude":16.17},"number_of_routes":15},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"Netherlands","longitude":5.75,"latitude":52.5},"number_of_routes":13},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"United Arab Emirates","longitude":54,"latitude":24},"number_of_routes":13},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"Canada","longitude":-95,"latitude":60},"number_of_routes":12},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"India","longitude":77,"latitude":20},"number_of_routes":8},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"Burma","longitude":98,"latitude":22},"number_of_routes":7},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"United Kingdom","longitude":-2,"latitude":54},"number_of_routes":7}].slice(0,10)
  return this.data.filter(function(d) {
    return _filter(d);
  }).sort(_sort).slice(0,10)

}



BarChart.prototype.updateVis = function(init){
  var that = this;

  this.titleElement.text(this.title);

  var selectedColumn = "value";
      
      
      this.max = d3.max(this.displayData, function(d) { return d[selectedColumn]; } );
      this.min = 0;

      this.offset = 20;
  
      this.xScale = d3.scale.linear().range([0, width]);
      var colorScale = d3.scale.category10();

      this.xScale.domain([this.min, this.max]);
      colorScale.domain([this.min, this.max]);
      
      this.bar_height = 10 //height / (data_draw.length + 5);
      
      groups = this.svg.selectAll("g").data(this.displayData);    
      groups.enter()
          .append("g")

        bars =  groups.append("rect")
                  .attr("width", function(d) { 
          return that.xScale(d[selectedColumn]); })
        .attr("height", this.bar_height)
                  .attr("x", 3)
                  .attr("y", 0)
        .attr("fill", function(d) { 
          return colorScale(d[selectedColumn]); }); 

      labels = groups.append("text")
        .attr("x", 0)
        .attr("y", 0)
          .attr("dy", ".8em")
        .attr("text-anchor", "end")
        .attr("class", "labels")
          
      values =  groups.append("text")
        .attr("y", 0)
        .attr("dy", ".8em")
        .attr("class", "values")
        
      
      //Update all
      groups
      .attr("transform",  function(d, i) {
        return "translate("+that.xScale(that.min)+","+((that.bar_height + 5) * i+that.offset)+")";
       });
 
      groups.select("rect")
        .attr("width", function(d) { 
          return that.xScale(d[selectedColumn]); })
        .attr("fill", function(d) { 
          return colorScale(d[selectedColumn]); }); 
  
      groups.select("text.labels")
        .text(function(d) { return d.label; });    
          
      groups.select("text.values")
        .attr("x", function(d) { return that.xScale(d[selectedColumn]) + 6; })
        .text(function(d) { return d3.format(",")(d[selectedColumn]); }); 
      
      
      if (!init) {
          groups.style("fill-opacity", 0)
          .transition()
          .duration(500)
          .style("fill-opacity", 1);
          
        groups.
        select("rect").style("fill-opacity", 0)
          .transition()
          .duration(500)
          .style("fill-opacity", 1);
      }
          
    }



BarChart.prototype.onSelectionChange= function (){

    this.wrangleData(function(d) { return d.origin.country != d.destination.country; }, function(a,b) {return b.number_of_passengers[2010]-a.number_of_passengers[2010]; },function(d) { return d.number_of_routes; }, "Top Flight Destinations:");

  this.updateVis();
}

  
BarChart.prototype.sortBars = function(sortingAnimation) {
      // Sort Elements     

      that  = this;
      var selectedSortColumn = "value";
        
      
      groupsToSort = this.svg.selectAll("g").sort(function (a,b) {
        if (a[selectedSortColumn] == b[selectedSortColumn]) 
        {
          return smartSort(a["name"], b["name"]); // break ties by sorting by country name
        } else {
          return smartSort(a[selectedSortColumn], b[selectedSortColumn]); 
        }
        
      })
    
      if (sortingAnimation > 0) {
        groupsToSort =  groupsToSort
          .transition()
          .duration(500)
      }
      
      groupsToSort.attr("transform",  function(d, i) {
        return "translate("+that.xScale(that.min)+","+((that.bar_height + 5) * i+that.offset)+")";
       });


     //Sorts columns with strings lexicographic (A-Z) and columns with numbers numerically (Big to Small)
      function smartSort(a, b) {
        switch (typeof(a)) {
          case "string": return d3.ascending(a, b);
          case "number": return a - b; //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
          default: return d3.ascending(a, b);
        }
      } 
    }



