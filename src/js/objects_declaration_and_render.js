
var spermatozoa = [];

var svg;
    
var head;
var tail;



function initiateSimulation()
{
	var canvas_container = d3.select("body").append("div").attr("id", "canvas_container");

	CANVAS_WIDTH = parseInt(d3.select("#canvas_container").style("width"));
	CANVAS_HEIGHT = parseInt(d3.select("#canvas_container").style("height"));
		
	svg = d3.select("#canvas_container").append("svg")
	.attr("id", "#canvas_container")
    .attr("width", CANVAS_WIDTH)
    .attr("height", CANVAS_HEIGHT);
    	
	createManyPoles(INITIAL_NUMBER_POLES);
	
	startGameLoop();
	
}

function updatePoles()
{
	
	var group = svg.selectAll("g")
    .data(spermatozoa, function(d){ return d.key; });
    	
	 var groupNew = group.enter().append("g");
	 
	 group.exit().remove();
	 
	 head_new = groupNew.append("ellipse")
	    .attr("rx", 6.5)
	    .attr("ry", 4);
	    
	 head = group.selectAll("ellipse");  
	
	groupNew.append("path")
	    .datum(function(d) { return d.path.slice(0, 3); })
	    .attr("class", "mid");
	
	groupNew.append("path")
	    .datum(function(d) { return d.path; })
	    .attr("class", "tail");
	
	tail = group.selectAll("path");
	 
	return group;

}


