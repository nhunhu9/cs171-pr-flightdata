//Based on template from http://jsfiddle.net/PcjUR/116/

BubbleChart = function(_parentElement, _data, _eventHandler){
  
  this.parentElement = _parentElement;
  this.data = _data;
  this.eventHandler = _eventHandler;
  this.displayData = [];
  this.circle = [];

  this.initVis();
}


BubbleChart.prototype.initVis = function(){

  var that = this; 

  var margin = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
  };
  this.width = width = 300 - margin.left - margin.right;
  this.height = height = 300 - margin.top - margin.bottom;

  var n = 6,
      m = 1,
      padding = 6;
  this.radius = d3.scale.sqrt().range([0, 3.5]);
  this.color = d3.scale.category10().domain(d3.range(m));
  this.x = d3.scale.ordinal().domain(d3.range(m)).rangePoints([0, width], 1);


  this.force = d3.layout.force()
      .size([width, height])
      .on("tick", tick)

  this.svg = this.parentElement.append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


   this.titleElement = this.svg.insert("text", ":first-child")
      .attr("id", "bubbleTitle")
      .attr("transform", "translate(20,20)")

  this.wrangleData(function(d) { return d.origin.country != d.destination.country; }, function(a,b) {return b.number_of_passengers[2010]-a.number_of_passengers[2010]; },function(d) { return d.number_of_routes; }, "Top Flight Destinations:");

  this.updateVis();

  this.force
    .nodes(this.displayData)
    .gravity(0)
    .charge(0)
    .start();

  function tick(e) {
    that.circle.each(gravity(.2 * e.alpha))
        .each(collide(.5))
        .attr("transform", function(d) { 
          return "translate(" + d.x + "," + d.y + ")"; })
}

// Move nodes toward cluster focus.
function gravity(alpha) {
    return function (d) {
        d.y += (d.cy - d.y) * alpha;
        d.x += (d.cx - d.x) * alpha;
    };
}

// Resolve collisions between nodes.
  function collide(alpha) {
    var quadtree = d3.geom.quadtree(that.displayData);
    return function (d) {
        var r = d.radius + that.radius.domain()[1] + padding,
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;
        quadtree.visit(function (quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== d)) {
                var x = d.x - quad.point.x,
                    y = d.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
                if (l < r) {
                    l = (l - r) / l * alpha;
                    d.x -= x *= l;
                    d.y -= y *= l;
                    quad.point.x += x;
                    quad.point.y += y;
                }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
    };
}


}

// level: default: city, alternative: country
BubbleChart.prototype.wrangleData= function(_filterFunction, _sort, _label, _title){

  that = this;

  this.title = _title;

  this.displayData = this.filterAndAggregate(_filterFunction, _sort).map(function (d) {
      var i = Math.floor(Math.random() * 1) //color
      return {
          radius: that.radius(d.number_of_routes),//radius: that.radius(d.number_of_passengers[2010]),
          color: that.color(i),
          cx: that.x(i),
          cy: that.height / 2,
          label: _label(d)
      };

  });

}

BubbleChart.prototype.filterAndAggregate = function(_filter, _sort){
    return [{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"Taiwan","longitude":121,"latitude":23.5},"number_of_routes":165},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"Japan","longitude":138,"latitude":36},"number_of_routes":146},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"South Korea","longitude":127.5,"latitude":37},"number_of_routes":120},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"Hong Kong","longitude":114.17,"latitude":22.25},"number_of_routes":107},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"United States","longitude":-97,"latitude":38},"number_of_routes":49},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"Thailand","longitude":100,"latitude":15},"number_of_routes":42},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"Macau","longitude":113.55,"latitude":22.17},"number_of_routes":37},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"Singapore","longitude":103.8,"latitude":1.37},"number_of_routes":37},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"Russia","longitude":100,"latitude":60},"number_of_routes":34},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"Malaysia","longitude":112.5,"latitude":2.5},"number_of_routes":22},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"Philippines","longitude":122,"latitude":13},"number_of_routes":19},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"Germany","longitude":9,"latitude":51},"number_of_routes":17},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"Australia","longitude":133,"latitude":-27},"number_of_routes":16},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"Vietnam","longitude":107.83,"latitude":16.17},"number_of_routes":15},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"Netherlands","longitude":5.75,"latitude":52.5},"number_of_routes":13},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"United Arab Emirates","longitude":54,"latitude":24},"number_of_routes":13},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"Canada","longitude":-95,"latitude":60},"number_of_routes":12},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"India","longitude":77,"latitude":20},"number_of_routes":8},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"Burma","longitude":98,"latitude":22},"number_of_routes":7},{"origin":{"country":"China","longitude":105,"latitude":35},"destination":{"country":"United Kingdom","longitude":-2,"latitude":54},"number_of_routes":7}].slice(0,10)
  return this.data.filter(function(d) {
    return _filter(d);
  }).sort(_sort).slice(0,10)

}



BubbleChart.prototype.updateVis = function(){
  var that = this;

  this.circle = this.svg.selectAll("g.node")
    .data(this.displayData)

  var circle_new = this.circle
    .enter().append("g")
    .attr("class", "node")
    .call(this.force.drag);

  circle_new
      .append("circle")
      .attr("r", function (d) {
          return d.radius;
      })
      .style("fill", function (d) {
          return d.color;
      })

  circle_new
      .append("text")
      .text(function (d) {return d.label})
      .attr("text-anchor", "middle")
      .style("fill", "#FFFFFF")

  this.circle.exit().remove();

  this.titleElement.text(this.title);
 
}


BubbleChart.prototype.onSelectionChange= function (){

    this.wrangleData(function(d) { return d.origin.country != d.destination.country; }, function(a,b) {return b.number_of_passengers[2010]-a.number_of_passengers[2010]; },function(d) { return d.number_of_routes; }, "Top Flight Destinations:");

  this.updateVis();
}



