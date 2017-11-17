/**
Casper van Velzen
11030275
Minor Programmeren / Data processing
creates a bar graph of the average precipitation at different weather stations during April 2017
*/



window.onload = function() {

	var width = 800,
	height = 450,
	padding = 0.3;

	// create svg container to build in
	var svg = d3.select(".chart")
		.attr("width", width)
		.attr("height", height);

	// create margins
	var margin = {top: 20, right: 30, bottom: 30, left: 40},
	    width = width - margin.left - margin.right,
	    height = height - margin.top - margin.bottom;
	
	var chart = d3.select(".chart").append("g")
			.attr("width", width)
			.attr("height", height);
	
	// load data
	var data = d3.json("json_data.json", function(data) {
		console.log(data);

	// create x axis
	var x = d3.scale.ordinal().rangeRoundBands([0, width], padding)
    	.domain(data.map(function(d) { return d.station; }));

    var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

    chart.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

    // create y axis
    var y = d3.scale.linear()
    	.range([height, 0])
    	.domain([5, d3.max(data, function(d) { return d.precipitation; })]);

    var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  	chart.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.attr("transform", "translate(" + margin.left + ",0)");

	// create tip
	tip = d3.tip()
		.attr("class", "tip")
		.html(function(d){
			return "<span>" + d.precipitation + "mm </span>";
		});

	// create bars
  	var bar = chart.selectAll(".bar")
		.data(data)
    .enter().append("rect")
		.attr("class", "bar")
		.attr("x", function(d) { return x(d.station); })
		.attr("y", function(d) { return y(d.precipitation); })
		.attr("height", function(d) { return height - y(d.precipitation); })
		.attr("width", x.rangeBand())
		.on("mouseover", function(d){tip.show(d);
			d3.select(this).style("fill", "black");
		})
		.on("mouseout", function(d){tip.hide(d);
			d3.select(this).style("fill", "steelblue")});

	bar.call(tip);
});
}
