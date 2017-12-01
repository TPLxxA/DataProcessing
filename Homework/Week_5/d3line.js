var parsetime = d3.timeParse("%m/%d/%Y")

window.onload = function(data) {

  // load both datasets
  d3.queue()
  .defer(d3.json, "temp_2005.json")
  .defer(d3.json, "temp_2006.json")
  .await(data_loaded); 
  }; 

  function data_loaded(error, data2005, data2006) {
      if (error) throw error;
      
      // processing data so that it has the right structure to fit in the graph
      var data = data2005;

      var min_temp = [];
      var max_temp = [];
      var avg_temp = [];

      data.forEach( function(d){
      var date = parsetime(d.date);
      min_temp.push({date: date, temperature: d.min_temp/10})
      max_temp.push({date: date, temperature: d.max_temp/10})
      avg_temp.push({date: date, temperature: d.avg_temp/10})
      });

      var useful_data = [{id: "min_temp", values: min_temp}, {id: "avg_temp", values: avg_temp}, {id: "max_temp", values: max_temp}];

      // create a container to draw in
      var svg = d3.select("svg"),
      margin = {top: 30, bottom: 50, left: 50, right: 50},
      width = svg.attr("width") - margin.left - margin.right,
      height = svg.attr("height") - margin.top - margin.bottom,
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var x = d3.scaleTime().range([0, width]),
      y = d3.scaleLinear().range([height, 0]),
      z = d3.scaleOrdinal(d3.schemeCategory10);

      // manual check if data loaded properly (for human use only)
      console.log(useful_data);

      // create domains for the lines
      x.domain(d3.extent(min_temp, function(d) { return d.date; }));

      y.domain([
          d3.min(min_temp, function(d) { return d.temperature; }),
          d3.max(max_temp, function(d) { return d.temperature; })
        ]);

      // create x axis
      g.append("g")
      .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      // create y axis
      g.append("g")
        .attr("class", "axis axis--y")
          .call(d3.axisLeft(y))
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("fill", "#000")
          .text("Temperature, C");

      z.domain(useful_data.map(function(d) { return d.id; }));

      // function to prepare line
      var line = d3.line()
        .curve(d3.curveBasis)
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.temperature); });

      // create a box for the lines to be drawn in
      var box_for_lines= g.selectAll(".box_for_lines")
        .data(useful_data)
        .enter().append("g")
        .attr("class", "box_for_lines" );

      // draw lines
      box_for_lines.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); }) 
        .style("stroke", function(d) { return z(d.id); })
        .style("fill", "none");

      // moving cross-hair
      var bisectDate = d3.bisector(function(d) { return d.date; }).left,
      formatValue = d3.format(",.1f"),
      formatTemperature = function(d) { return "Cº " + formatValue(d); };;

      var focus = svg.append("g")
        .attr("class", "focus")
        .style("display", "none");

      focus.append("circle")
          .attr("r", 4.5);

      focus.append("text")
          .attr("x", 9)
          .attr("dy", ".35em");

      g.append("rect")
          .attr("class", "overlay")
          .attr("width", width)
          .attr("height", height)
          .on("mouseover", function() { focus.style("display", null); })
          .on("mouseout", function() { focus.style("display", "none"); })
          .on("mousemove", mouseMove);

      function mouseMove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(useful_data[1].values, x0, 1),
            d0 = useful_data[1].values[i - 1],
            d1 = useful_data[1].values[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        focus.attr("transform", "translate(" + (x(d.date) + margin.left) + "," + (y(d.temperature) + margin.top) + ")");
        focus.select("text").text(formatTemperature(d.temperature));
      }

      // this is where I would write an update function if I had the time
        
};
