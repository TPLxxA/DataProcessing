document.addEventListener("DOMContentLoaded", function() {
	// collects data from index.html	
	// remember lists to fill later
	var dates = [];
	var temp = [];

	// collect rawdata from index.html
	var rawdata = document.getElementById("rawdata");
	
	// split all rows
	var rows = rawdata.value.split("\n");

	// split every row into dates and temp
	for (var i = 0; i < rows.length - 1; i++) {
		var data = rows[i].split(",");
		// split date into YYYYMMDD
		var yyyy = data[0].substr(2, 4);
		var mm = data[0].substr(6, 2);
		var dd = data[0].substr(8, 2);
		d = new Date(yyyy, mm, dd);
		// put data in arrays
		dates.push(d);
		temp.push(parseInt(data[1]));
	}
	console.log(temp);
	console.log(dates);

	// create canvas
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	
	// create x and y axis
	ctx.beginPath();
	ctx.moveTo(50, 0);
	ctx.lineTo(50, canvas.height - 50);
	ctx.lineTo(canvas.width, canvas.height - 50)
	ctx.stroke();
})

function createTransform(domain, range){
	// domain is a two-element array of the data bounds [domain_min, domain_max]
	// range is a two-element array of the screen bounds [range_min, range_max]
	// this gives you two equations to solve:
	// range_min = alpha * domain_min + beta
	// range_max = alpha * domain_max + beta
 		// a solution would be:

    var domain_min = domain[0]
    var domain_max = domain[1]
    var range_min = range[0]
    var range_max = range[1]

    // formulas to calculate the alpha and the beta
   	var alpha = (range_max - range_min) / (domain_max - domain_min)
    var beta = range_max - alpha * domain_max

    // returns the function for the linear transformation (y= a * x + b)
    return function(x){
      return alpha * x + beta;
    }
}