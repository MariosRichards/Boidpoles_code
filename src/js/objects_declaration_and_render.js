var svg = d3.select("body").append("svg")
    .attr("width", CANVAS_WIDTH)
    .attr("height", CANVAS_HEIGHT);
    
var head;
var tail;

updatePoles();

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


