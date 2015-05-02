LineChart = function(_parentElement, _data, _metaData, _eventHandler){
  
  this.parentElement = _parentElement;
  this.data = _data;
  this.metaData = _metaData;
  this.eventHandler = _eventHandler;
  this.displayData = [];
  this.color = d3.scale.category10()


  this.margin = {top: 20, right: 20, bottom: 170, left: 60},
  this.width =  650 - this.margin.left - this.margin.right,
  this.height = 440 - this.margin.top - this.margin.bottom;

  this.initVis();
}


LineChart.prototype.initVis = function(){

  var that = this; 

  this.svg = this.parentElement.select("svg")
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

  this.xScale = d3.scale.linear().range([0, this.width]).domain([1990,2010]);
  this.yScale = d3.scale.linear().range([this.height, 0]);
  
  this.xAxis = d3.svg.axis()
    .scale(this.xScale)
    .ticks(5)
    .orient("bottom");

  this.yAxis = d3.svg.axis()
    .scale(this.yScale)
    .orient("left");

  this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")")

  this.svg.append("g")
        .attr("class", "y axis")

  this.line = d3.svg.line()
    .x(function(d) { return that.xScale(d["year"]); })
    .y(function(d) { return that.yScale(d["pass"]); })
    .interpolate("monotone");;


  this.wrangleData();
  this.updateVis();
  
}


LineChart.prototype.wrangleData= function(_filterFunction){
  this.displayData = this.filterAndAggregate("Japan");
}

LineChart.prototype.filterAndAggregate = function(_filter){

    var filter = _filter || function(){return false;}

    var that = this;

    var filteredData =  this.data.filter(function(d) {
      return d["departure_country"] == filter;
    });
    
    nested_data = d3.nest()
      .key(function(d){return d.departure_city})
      .rollup(function(leaves){ return{
        "no_1990": d3.sum(leaves, function(d){return d.no_1990}),
        "no_1995": d3.sum(leaves, function(d){return d.no_1995}),
        "no_2000": d3.sum(leaves, function(d){return d.no_2000}),
        "no_2005": d3.sum(leaves, function(d){return d.no_2005}),
        "no_2010": d3.sum(leaves, function(d){return d.no_2010}),
      }})
      .entries(filteredData);
    nested_data.sort(function(a, b) {
              return d3.descending(a["values"]["no_1990"], b["values"]["no_1990"]);});

    var displayData = [];
    var city_data = [];
    nested_data.map(function(d, i){
      if(i < 5) {
        var age = [
          {
            "year": "1990",
            "pass": d["values"]["no_1990"],
          },{
            "year": "1995",
            "pass": d["values"]["no_1995"],
          },{
            "year": "2000",
            "pass": d["values"]["no_2000"],
          },{
            "year": "2005",
            "pass": d["values"]["no_2005"],
          },{
            "year": "2010",
            "pass": d["values"]["no_2010"],
          },
          ];
        city_data = [{"city": d["key"], "data": age}];
        displayData = displayData.concat(city_data);
      }
    })
    return displayData;
}

LineChart.prototype.updateVis = function(){
  var that = this;

  var max = d3.max(that.displayData[0]["data"], function(d){return d.pass})
  var min = d3.min(that.displayData[4]["data"], function(d){return d.pass})
  this.yScale.domain([min, max])

  this.svg.select(".x.axis")
        .call(this.xAxis)

  this.svg.select(".y.axis")
        .call(this.yAxis)

  for (i = 0; i < 5; i++){
    this.svg.append("path")
    .attr('d', that.line(that.displayData[i]["data"]))
    .attr('stroke', that.color(i))
    .attr('stroke-width', 2)
    .attr('fill', 'none')
    .text(that.displayData[i]["city"]);;
  }

}


LineChart.prototype.onSelectionChange= function (ranges){
}