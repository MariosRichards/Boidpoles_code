
var spermatozoa = [];

var bullets = [];

var svg;
    
var head;
var tail;

var bullet_head;


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
	
	createManyBullets(INITIAL_NUMBER_BULLETS);
	
	startGameLoop();
	
}

function updatePoles()
{
	
	var group = svg.selectAll(".pole")
    .data(spermatozoa, function(d){ return d.key; });
    	
	 var groupNew = group.enter().append("g").attr("class", "pole");
	 
	 group.exit().remove();
	 
	 var head_new = groupNew.append("ellipse").attr("class", "pole_head").attr("fill","#ffF")
	    .attr("rx", 6.5)
	    .attr("ry", 4);
	    
	 head = group.selectAll(".pole_head");  
	
	groupNew.append("path")
	    .datum(function(d) { return d.path.slice(0, 3); })
	    .attr("class", "mid_tail").attr("class", "pole_tail");
	
	groupNew.append("path")
	    .datum(function(d) { return d.path; })
	    .attr("class", "end_tail").attr("class", "pole_tail");
	
	tail = group.selectAll(".pole_tail");
	 

}

function updateBullets()
{
	
	var group = svg.selectAll(".bullet")
    .data(bullets, function(d){ return d.key; });
    	
	 var groupNew = group.enter().append("g").attr("class", "bullet");
	 
	 group.exit().remove();
	 
	 var bullet_head_new = groupNew.append("ellipse").attr("class", "bullet_head").attr("fill","#f00")
	    .attr("rx", 6.5)
	    .attr("ry", 4);
	    
	 bullet_head = group.selectAll(".bullet_head");  
		 

}


