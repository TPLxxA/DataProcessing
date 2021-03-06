/**
Casper van Velzen
11030275
Minor Programmeren / Data processing
creates a scatter plot comparing avarage schooling with literacy and linguistic diversity index
for adults in different countries
*/

window.onload = function() {

  // size of entire graph
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

  // create x and y axis
  var x = d3.scale.linear()
    .range([0, width]);

  var y = d3.scale.linear()
    .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  // create box to place graph and axis in
  var svg = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

  // create box for the actual graph
  var svg = d3.select(".chart")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // load data
  d3.json("json_data.json", function(error, data) {
  if (error) throw error;
  console.log(data)

  data.forEach(function(d) {
    d.schooling = +d.schooling;
    d.literacy = +d.literacy;
  });

  // annotate axis
  x.domain(d3.extent(data, function(d) { return d.literacy; })).nice();
  y.domain(d3.extent(data, function(d) { return d.schooling; })).nice();

  // print x axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("adult literacy (%)");

  // print y axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("average schooling adults (yrs)")

  // create tooltip
  tip = d3.tip()
    .attr("class", "tip")
    .html(function(d){
      return "<span>" + d.country + "</span><span> " + d.ldi + "</span>";
    });

  // color scaling
  var color = d3.scale.linear().domain([1,length])
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb("#005824"), d3.rgb('#ccece6')]);

  // create dots for every data point
  var dot = svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", function(d) { return x(d.literacy); })
      .attr("cy", function(d) { return y(d.schooling); })
      .style("fill", function(d) { return color(d.ldi); })
      .on("mouseover", function(d){tip.show(d);
        d3.select(this);
      })
      .on("mouseout", function(d){tip.hide(d);
        d3.select(this)});

  // call tooltip
  dot.call(tip);

  // intiate legend
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // place coloured blocks in legend
  legend.append("rect")
      .attr("x", width - 180)
      .attr("y", 9)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  // place text in legend
  legend.append("text")
      .attr("x", width - 148)
      .attr("y", 18)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

  // legend header
  svg.append("text")
      .attr("x", width - 156)
      .attr("y", 0)
      .style("text-anchor", "end")
      .text('LDI');

  });

}