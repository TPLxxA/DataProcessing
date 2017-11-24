window.onload = function() {
	// Load test.svg
	d3.xml("test.svg", "image/svg+xml", function(error, xml) {
	    if (error) throw error;    
	    document.body.appendChild(xml.documentElement);    
	});

	// data
	var colours = ['#ccece6','#99d8c9','#66c2a4','#41ae76','#238b45','#005824']

	// remember these for later
	var body = d3.select("svg");
	var y = 96.8;

	var box = canvas.selectAll(".st1")
		.data(colours)
	.enter().append("rect")
		.attr("class", "st1")
		.attr("x", 13)
		.attr("y", function (d) { y += 41.9; return y})
		.attr("height", 29)
		.attr("width", 21)
		.attr("style", "fill" + colours);


};