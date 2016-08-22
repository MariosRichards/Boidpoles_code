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
	    key: UNIQUE_KEY,
    	collision_cooldown: COLLISION_COOLDOWN
		
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