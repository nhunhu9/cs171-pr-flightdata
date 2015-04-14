LineChart = function(_parentElement, _data, _metaData, _eventHandler){
  
  this.parentElement = _parentElement;
  this.data = _data;
  this.metaData = _metaData;
  this.eventHandler = _eventHandler;
  this.displayData = [];

  this.margin = {top: 20, right: 0, bottom: 170, left: 60},
  this.width =  650 - this.margin.left - this.margin.right,
  this.height = 440 - this.margin.top - this.margin.bottom;

  this.initVis();
}


LineChart.prototype.initVis = function(){

  var that = this; 

  this.svg = this.parentElement.select("svg")
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

  this.xScale = d3.scale.linear().range([0, this.width]).domain([2000,2010]);
  this.yScale = d3.scale.linear().range([this.height, 0]).domain([0,100]);
  this.xAxis = d3.svg.axis()
    .scale(this.xScale)
    .orient("bottom");

  this.yAxis = d3.svg.axis()
    .scale(this.yScale)
    .orient("left");

  this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")")

    this.svg.append("g")
        .attr("class", "y axis")

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


}


LineChart.prototype.onSelectionChange= function (ranges){
}