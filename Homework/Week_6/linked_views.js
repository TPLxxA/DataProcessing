/**
Casper van Velzen
11030275
Minor Programmeren / Data processing
Links a grouped bar chart of the quality of life index and the safety index to a line chart of 
the purchasing power index per country from 2014 to 2017
*/

window.onload = function() {
  
	// load all datasets
	d3.queue()
	.defer(d3.json, "qoli2017.json")
	.defer(d3.json, "ppi_all.json")
	.defer(d3.json, "si.json")
	.await(data_loaded); 
	};

	function data_loaded(error, qoli_data, ppi_all_data, safety_index_data) {
		if (error) throw error;
		double_bar(qoli_data, safety_index_data);
		line_graph(ppi_all_data);

	function line_graph(ppi_data) {
		d3.selectAll(".g")
			.remove();


		// gives an error on load, because it has no data, but that's fine
	    var country_data = ppi_data;
	    var data = [{year: 2014, ppi: country_data['ppi2014']}, {year: 2015, ppi: country_data['ppi2015']}, 
	    		{year: 2016, ppi: country_data['ppi2016']}, {year: 2017, ppi: country_data['ppi2017']}];

	    var svg = d3.select("#linesvg"),
	        margin = {top: 10, right: 10, bottom: 16, left: 26},
	        width = +svg.attr("width") - margin.left - margin.right,
	        height = +svg.attr("height") - margin.top - margin.bottom,
	        g = svg.append("g").attr("class", "g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	    var x = d3.scaleLinear()
	        .rangeRound([0, width]);

	    var y = d3.scaleLinear()
	        .rangeRound([height, 0]);

	    var line = d3.line()
	        .x(function(d) { return x(d.year); })
	        .y(function(d) { return y(d.ppi); });

	      x.domain(d3.extent(data, function(d) { return d.year; }));
	      y.domain([0, 180]);

	      g.append("g")
	          .attr("transform", "translate(0," + height + ")")
	          .call(d3.axisBottom(x)
	          	.ticks(4)	
	          	.tickFormat(function(d) { return d; }));

	      g.append("g")
	          .call(d3.axisLeft(y))
	        .append("text")
	          .attr("fill", "#000")
	          .attr("font-size", 12)
	          .attr("transform", "rotate(-90)")
	          .attr("y", 6)
	          .attr("dy", "0.71em")
	          .attr("text-anchor", "end")
	          .text("purchasing power index");

	      g.append("path")
	          .datum(data)
	          .attr("fill", "none")
	          .attr("stroke", "steelblue")
	          .attr("stroke-linejoin", "round")
	          .attr("stroke-linecap", "round")
	          .attr("stroke-width", 1.5)
	          .attr("d", line);
	    };
	
	function double_bar(qoli_data, safety_index_data) {
	  var svg = d3.select("#barsvg"),
	    margin = {top: 20, right: 20, bottom: 120, left: 40},
	    width = +svg.attr("width") - margin.left - margin.right,
	    height = +svg.attr("height") - margin.top - margin.bottom,
	    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	  var x0 = d3.scaleBand()
	      .rangeRound([0, width])
	      .paddingInner(0.1);

	  var x1 = d3.scaleBand()
	      .padding(0.05);

	  var y = d3.scaleLinear()
	      .rangeRound([height, 0]);

	  var z = d3.scaleOrdinal()
	      .range(["#98abc5", "#ff8c00"]);

	  // prepare data
	  var data = [];
	  // si and qoli json files are in the same order
	  for (var i = 0; i < 28; i = i + 1) {
	  	data[i] = {country: qoli_data[i]['country'], qoli: qoli_data[i]['qoli'], si: safety_index_data[i]['safety_index']};
	  }

	  var keys = ['si', 'qoli'];

	  x0.domain(data.map(function(d) { return d.country; }));
      x1.domain(keys).rangeRound([0, x0.bandwidth()]);
      y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

      g.append("g")
      .selectAll("g")
      .data(data)
      .enter().append("g")
        .attr("transform", function(d) { return "translate(" + x0(d.country) + ",0)"; })
      .selectAll("rect")
      .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
      .enter().append("rect")
        .attr("x", function(d) { return x1(d.key); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", x1.bandwidth())
        .attr("height", function(d) { return height - y(d.value); })
        .attr("fill", function(d) { return z(d.key); });

		g.append("g")
	          .attr("class", "axis")
	          .attr("transform", "translate(0," + height + ")")
	        .call(d3.axisBottom(x0))
	        .selectAll("text")
	          .style("text-anchor", "end")
        	  .attr("dx", "-.8em")
        	  .attr("dy", "-.75em")
	          .attr("transform", "rotate(-90)")
	          .on("mouseover", function(d) { d3.select(this).style("cursor", "pointer"); })
	          .on("mouseout", function(d) { d3.select(this).style("cursor", "default"); })
	          .on("click", function(d) { for (var i = 0; i < 28; i = i + 1) {
	          	if (d == ppi_all_data[i]['country']) {
	          	console.log(d);
	          	line_graph(ppi_all_data[i]);
	          	};
	          }; 
	          });

	    g.append("g")
	        .attr("class", "axis")
	        .call(d3.axisLeft(y).ticks(null, "s"))
	      .append("text")
	        .attr("x", 2)
	        .attr("y", y(y.ticks().pop()) + 0.5)
	        .attr("dy", "0.32em")
	        .attr("fill", "#000")
	        .attr("font-weight", "bold")
	        .attr("text-anchor", "start")
	        .text("Index score");

	    var legend = g.append("g")
	        .attr("font-family", "sans-serif")
	        .attr("font-size", 10)
	        .attr("text-anchor", "end")
	      .selectAll("g")
	      .data(keys.slice().reverse())
	      .enter().append("g")
	        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	    legend.append("rect")
	        .attr("x", width - 19)
	        .attr("width", 19)
	        .attr("height", 19)
	        .attr("fill", z);

	    legend.append("text")
	        .attr("x", width - 24)
	        .attr("y", 9.5)
	        .attr("dy", "0.32em")
	        .text(function(d, i) { if (i == 0) { return 'quality of life'} else { return 'safety'} });
		};

	};