LineChart = function(_parentElement, _data, _metaData, _eventHandler){
  
  this.parentElement = _parentElement;
  this.data = _data;
  this.metaData = _metaData;
  this.eventHandler = _eventHandler;
  this.displayData = [];

  this.sampledata = [{
    "no_pass": "202",
    "year": "1990"
}, {
    "no_pass": "215",
    "year": "1995"
}, {
    "no_pass": "179",
    "year": "2000"
}, {
    "no_pass": "199",
    "year": "2005"
}, {
    "no_pass": "134",
    "year": "2010"
}];

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
  this.yScale = d3.scale.linear().range([this.height, 0]).domain([110,215]);
  
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
    .x(function(d) { return that.xScale(d.year); })
    .y(function(d) { return that.yScale(d.no_pass); })
    .interpolate("monotone");;


  this.updateVis();
  
}


LineChart.prototype.wrangleData= function(_filterFunction){
  this.displayData = this.filterAndAggregate(_filterFunction);
}

LineChart.prototype.filterAndAggregate = function(_filter){

    var filter = _filter || function(){return false;}


    var that = this;

    var res =  this.data.filter(function(d) {
      return filter(d);
    });

    return res;

}



LineChart.prototype.updateVis = function(){
  var that = this;

  this.svg.select(".x.axis")
        .call(this.xAxis)

  this.svg.select(".y.axis")
        .call(this.yAxis)

  this.svg.append("path")
      .attr("d", that.line(that.sampledata))
      .attr('stroke', 'green')
      .attr('stroke-width', 2)
      .attr('fill', 'none');;


}


LineChart.prototype.onSelectionChange= function (ranges){
}