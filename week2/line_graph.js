/**
Casper van Velzen
11030275
Minor Programmeren / Data processing
creates a graph of the temerature in de Bilt in 1997
*/
const padding = 50;
const months = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli',
				'augustus', 'september', 'oktober', 'november', 'december'];
var dates = [];
var temp = [];

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    	var rawdata = xhttp.response;
    	
    	rawdata = parseData(rawdata);
    	temp = rawdata[1];
    	dates = rawdata[0];
    	
    	createCanvas(temp, dates);
    }
};
xhttp.open("GET", "KNMI_19971231.txt", true);
xhttp.send();

function createCanvas(temp, dates){
	// create canvas
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	
	// create x and y axis
	ctx.beginPath();
	ctx.moveTo(padding, 0);
	ctx.lineTo(padding, canvas.height - padding);
	ctx.lineTo(canvas.width, canvas.height - padding)
	ctx.stroke();

	// prepare to draw graph
	var minmax = seekMinMax(temp);
	ctx.moveTo(padding, 0);

	// calculate coordinates for every data point
	var xData = createTransform([0, temp.length], [padding, canvas.width]);
	var yData = createTransform(minmax, [canvas.height - padding, 0]);
	for (var i = 0; i < temp.length; i++){
		var xTemp = xData(i);
		var yTemp = yData(temp[i]);
		// draw graph
		ctx.lineTo(xTemp, yTemp);
	}
	ctx.stroke();

	// annotate y axis
	for (var i = -100; i < minmax[1]; i += 50){
		var yZero = yData(i);
		ctx.fillText((i / 10), 25, yZero, padding);
		ctx.moveTo(padding, yZero);
		ctx.lineTo(padding - 10, yZero);
	}
	ctx.stroke();


	// annotate x axis
	var xMonth = createTransform([0, 11], [padding, canvas.width - 50]);
	var month = 1000;
	for (var i = 0; i < dates.length; i++){
		var curr_month = dates[i].getMonth();
		if (curr_month != month){
			month = curr_month;
			var xCoord = xMonth(month);
			ctx.fillText(months[month], xCoord - 10, canvas.height - 25);
			ctx.moveTo(xCoord, canvas.height - padding);
			ctx.lineTo(xCoord, canvas.height - padding + 10);
		}
	}
	ctx.stroke();
}
function parseData(rawdata){
	// split all rows
	var rows = rawdata.split("\n");

	// split every row into dates and temp
	for (var i = 0; i < rows.length - 1; i++) {
		var data = rows[i].split(",");
		// split date into YYYYMMDD
		var yyyy = data[1].substr(2, 4);
		var mm = data[1].substr(6, 2);
		var dd = data[1].substr(8, 2);
		var d = new Date(yyyy, mm, dd);
		// put data in arrays
		dates.push(d);
		temp.push(parseInt(data[2]));
	}
	return [dates, temp];
}

function seekMinMax(data){
	// iterate over array to find min and max
	var min = 0;
	var max = 0;
	for (var i = 0; i < data.length; i++){
		if (data[i] < min){
			min = data[i];
		}
		else if (data[i] > max){
			max = data[i];
		}
	}
	return [min, max];
}

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