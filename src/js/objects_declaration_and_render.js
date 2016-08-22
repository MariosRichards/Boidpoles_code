var svg = d3.select("body").append("svg")
    .attr("width", CANVAS_WIDTH)
    .attr("height", CANVAS_HEIGHT);
    

var g = updatePoles();

var head = g.append("ellipse")
	    .attr("rx", 6.5)
	    .attr("ry", 4);
	
g.append("path")
    .datum(function(d) { return d.path.slice(0, 3); })
    .attr("class", "mid");

g.append("path")
    .datum(function(d) { return d.path; })
    .attr("class", "tail");

var tail = g.selectAll("path");

function updatePoles()
{
	
	var group = svg.selectAll("g")
    .data(spermatozoa, function(d){ return d.key; });
    
    /*group.enter().append("g").on("click", function(d, i){
   	   	   	   	
   		spermatozoa.splice(i, 1);
   		   		
   		NUMBER_POLES -= 1;
   	
    	updatePoles();
    
	 });*/
	
	 var groupNew = group.enter().append("g");
	 
	 group.exit().remove();
	 
	 var head = groupNew.append("ellipse")
	    .attr("rx", 6.5)
	    .attr("ry", 4);
	
	groupNew.append("path")
	    .datum(function(d) { return d.path.slice(0, 3); })
	    .attr("class", "mid");
	
	groupNew.append("path")
	    .datum(function(d) { return d.path; })
	    .attr("class", "tail");
	
	var tail = groupNew.selectAll("path");
	 
	return group;

}

function deletePoleByKey(key)
{
	spermatozoa.splice(key, 1);
	
	updatePoles();
}

function createNewPole()
{	
	
	UNIQUE_KEY += 1;
	
	var x = Math.random() * CANVAS_WIDTH,
		y = Math.random() * CANVAS_HEIGHT;
	
	var new_pole = {
		
		vx: getVelocityValueX(),
	    vy: getVelocityValueY(),
	    path: d3.range(TAIL_LENGTH).map(function() { return [x, y]; }),
	    count: 0,
	    key: UNIQUE_KEY
		
	};
	
	spermatozoa.push(new_pole);
					
	updatePoles();
		
}

function deleteAllPoles()
{
	spermatozoa = [];
	
	updatePoles();
}

function createManyPoles(number) {
	
	for(var i=0;i<number;i++)
	{
		createNewPole();
	}
}

