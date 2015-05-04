Table = function(_parentElement, _data,_eventHandler){
  
  this.parentElement = _parentElement;
  this.data = _data;
  this.eventHandler = _eventHandler;
  this.displayData = [];
  draw(this.data)
}




  var that = this; 

  var titles = ["Airline Name", "Airline Country", "Number of Routes"];
  var variable_names = ["airline", "country", "count"]


  function draw(data){
    var container = d3.select("#table").append("div")
                          .attr("class", "contain");
    var table = d3.select(".contain").append("table"),


        thead = table.append("thead")
                     .attr("class", "thead");

        tbody = table.append("tbody");

        table.attr("class", "table table-hover table-bordered table-condensed");
        table.attr("data-search", "true")
        table.attr("id", "airline_ranking")
        table.attr("cellspacing", "0");
        table.attr("width", "80%");


        d3.select("caption").style("color", "black")
        

        thead.append("tr").selectAll("th")
          .data(titles)
        .enter()
          .append("th")
          .text(function(d) {return d; })


        var rows = tbody.selectAll("tr.row")
          .data(data)
          .enter()
          .append("tr").attr("class", "row");

        var cells = rows.selectAll("td")
          .data(function(row) {
            return variable_names.map(function(column) {
              return row[column]
            });
          })
          .enter()
          .append("td")
          .attr("class", "cell")
          .text(function(d) { return d; }); 

          $('#airline_ranking').dataTable({
        
            });


    }




Table.prototype.updateVis = function(){
  var that = this;
  
  
}

//FILTER FUNCTION: filter data that has continent = name
function getData(data, name) {
          return data.filter(function(d){
            return d["continent"] == name;
          });
}

Table.prototype.onSelectionChange= function (ranges){
  var name = ranges["subitemClicked"].id;
  console.log(name)
  var new_data = getData(this.data, name)
  console.log(this.data)
  console.log(new_data)
  d3.select("#airline_ranking_wrapper").remove()
  draw(new_data)


}



// HELPERS






