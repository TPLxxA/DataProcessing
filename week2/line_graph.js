document.addEventListener("DOMContentLoaded", function() {
// collects data from index.html	
	// remember lists to fill later
	var dates = [];
	var temp = [];

	// collect rawdata from index.html
	var rawdata = document.getElementById("rawdata");

	// remove all white spaces from rawdata
	rawdata = rawdata.value.replace(/ /g,'');
	
	// split all rows
	var rows = rawdata.split("\n");

	// split every row into dates and temp
	for (var i = 0; i < rows.length - 1; i++) {
		var data = rows[i].split(",");
		data[0] = data[0].toDateString();
		dates.push(data[0]);
		temp.push(data[1]);
	}
	console.log(dates);
})