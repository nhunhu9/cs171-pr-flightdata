WorldMap = function(_parentElement, _data, _metaData, _eventHandler){
    this.parentElement = _parentElement;
    this.data = _data;
    this.metaData = _metaData;
    this.eventHandler = _eventHandler;
    this.displayData = [];

    this.margin = {top: 20, right: 20, bottom: 30, left: 70},
    this.width = 650 - this.margin.left - this.margin.right,
    this.height = 330 - this.margin.top - this.margin.bottom;


    this.initVis();
}


WorldMap.prototype.initVis = function(){

    var that = this; 


    this.svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.svg.append("text")
        .attr("class", "vis_label")
        .text("Number of votes -- scroll to zoom, brush to select range:")
        .attr("x", 5)
        .attr("y", -5)


    this.brush_labels = [] 

    this.brush_labels.push(this.svg.append("text")
      .attr("class", "brush_label"))

    this.brush_labels.push(this.svg.append("text")
      .attr("class", "brush_label"))

    this.wrangleData();



    this.x = d3.time.scale()
        .range([0, this.width]);

    this.y = d3.scale.pow()
        .exponent(0.01)
        .range([this.height, 0]);

    this.xAxis = d3.svg.axis()
        .scale(this.x)
        .orient("bottom");

    this.yAxis = d3.svg.axis()
        .scale(this.y)
        .orient("left");

    this.area = d3.svg.area()
        .x(function(d) { return that.x(d.time); })
        .y0(this.height)
        .y1(function(d) { return that.y(d.count); });


    this.brush = d3.svg.multibrush(this.eventHandler)
      .on("brush", function(){
          $(that.eventHandler).trigger("selectionChanged", that.brush);
      })
      .on("clear", function() {
        $(that.eventHandler).trigger("selectionChanged", that.brush);
      });

      this.brush.resizeAdaption(
          function (selection) {
            selection.select("rect").attr("height", that.height);
          }
        );

      this.brush.extentAdaption(
        function (selection, i) {
            selection.attr("height", that.height);
            selection.append("text").text("brush " + i);

          }
        );

      this.svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + this.height + ")")
          .call(this.xAxis);

      this.svg.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(0,0)")
          .call(this.yAxis)

    this.svg.append("g")
      .attr("class", "brush");

   this.updateVis();
}




WorldMap.prototype.wrangleData= function(){
    this.displayData = this.data;
}



WorldMap.prototype.updateVis = function(){
 // updates scales
    this.x.domain(d3.extent(this.displayData, function(d) { return d.time; }));
    this.y.domain(d3.extent(this.displayData, function(d) { return d.count; }));

    // updates axis
    this.svg.select(".x.axis")
        .call(this.xAxis);

    this.svg.select(".y.axis")
        .call(this.yAxis)

    // updates graph
    var path = this.svg.selectAll(".area")
      .data([this.displayData])

    path.enter()
      .append("path")
      .attr("class", "area");

    path
      //.transition()
      .attr("d", this.area);


//      path.call(d3.behavior.zoom().x(this.x).y(this.y).on("zoom", this.updateVis()));

    path.exit()
      .remove();

    this.brush.x(this.x);
    this.svg.select(".brush")
        .call(this.brush)
      .selectAll("rect")
        .attr("height", this.height);
   }


WorldMap.prototype.onSelectionChange= function (ranges){

    that = this;
    d3.selectAll(".brush_label").text("");
 
      ranges.forEach(function(r, i) {

        that.brush_labels[i]
          .text("Brush " + (i+1))
          .attr("y", 15)
          .attr("x", (that.x(r[0]) + that.x(r[1])) /2)
      });
    


}

// HELPERS

 var getInnerWidth = function(element) {
        var style = window.getComputedStyle(element.node(), null);

        return parseInt(style.getPropertyValue('width'));
    }


 var getInnerHeight = function(element) {
        var style = window.getComputedStyle(element.node(), null);

        return parseInt(style.getPropertyValue('height'));
    }





