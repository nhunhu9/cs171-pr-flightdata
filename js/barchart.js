/* TODO: 
Color / Continent
Selection Changed (incl. title changing)
reduce to one chart? / understand, check data

*/

BarChart = function(_parentElement, _data, _mode, _eventHandler){
  
  this.parentElement = _parentElement;
  this.data = _data;
  this.eventHandler = _eventHandler;
  this.displayData = [];  
  this.mode = _mode;

  if (this.mode == "arrival") {
    this.key = function(d) { return d.arrival_country; }
  } else if (this.mode == "departure") {
    this.key = function(d) { return d.departure_country; }  
  } 

  this.initVis();
}


BarChart.prototype.initVis = function(){

  var that = this; 

  var margin = {
      top: 10,
      right: 120,
      bottom: 10,
      left: 120
  };
  this.width = width = 360 - margin.left - margin.right;
  this.height = height = 300 - margin.top - margin.bottom;



  this.svg = this.parentElement.append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("class", "bar")
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


 this.titleElement = this.svg.insert("text", ":first-child")
    .attr("class", "title")
 //   .attr("transform", "translate(" + -margin.left + ",0)");
  
    this.onSelectionChange({level:"world"}, true);

}

// level: default: city, alternative: country
BarChart.prototype.wrangleData= function(_filterFunction, _value, _title){

  that = this;

  this.title = _title;

  this.displayData = this.filterAndAggregate(_filterFunction, _value).map(function (d) {
      return {
          label: d.key,
          value: d.values,
          //color: colorScale(d), write function to get continent
      };

  });

}

BarChart.prototype.filterAndAggregate = function(_filter, _value){
  var filtered_data = this.data.filter(function(d) {
    return _filter(d);
  })

  var nested_data = d3.nest()
    .key(this.key)
    .rollup(function(leaves) { return d3.sum(leaves, function(d) {return parseFloat(_value(d));}) })
    .entries(filtered_data);

  return nested_data.sort(function(a,b) {return b.values-a.values; }).slice(0,10)

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
      
      this.bar_height = 20 //height / (data_draw.length + 5);
      
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

    groups.exit().remove();
        
      
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



BarChart.prototype.onSelectionChange= function (args, init){
  var that = this;
  if (args.level == "world") {
      this.wrangleData(
      function(d) { return d.departure_country != d.arrival_country; }, 
      function(d) { return d.no_2010; }
    );
  
    this.updateVis();
  } else if (args.level == "country") {
    var country = args.subitemClicked.properties.name;

    this.wrangleData(
      function(d) { return (that.mode == "arrival" ? d.departure_country : d.arrival_country) ==  country}, 
      function(d) { return d.no_2010; }
    );
  
    this.updateVis();
  }
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



