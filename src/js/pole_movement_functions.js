function bounceWalls(x,y,pole)
{
	if (x < 0 || x > CANVAS_WIDTH) pole.vx *= -1;
    if (y < 0 || y > CANVAS_HEIGHT) pole.vy *= -1;
    
}

function poleSwim(x,y,dx,dy,k1,path,count,pole)
{
	for (var j = 1; j < path.length; j++) {
      var vx = x - path[j][0],
          vy = y - path[j][1],
          k2 = Math.sin( ( (pole.count++) * count + j * 3) / 300 ) ;
	  x += dx  * k1;
	  y += dy  * k1;
      path[j][0] = x - dy * k2; // rotated
      path[j][1] = y + dx * k2;
	  //dx = vx;
	  //dy = vy;
      //speed = Math.sqrt(dx * dx + dy * dy);
	  [dx, dy] = unitVectors(vx,vy);
    }
}

function poleRotate(pole)
{
	
	/*this.intended_steering = 0; //In BaseRangeAngle Units
		this.steering_completed = 0; //In BaseRangeAngle Units
		this.max_steering_per_tick = 8;*/

	var steering_left = pole.intended_steering - pole.amount_steering_completed;

	if(steering_left != 0)
	{
				
		var radianMax = baseRangeAngleToRadians(pole.max_steering_per_tick);
					
		if(steering_left >radianMax)
		{
			steering_left = radianMax;
		} 
		if(steering_left < -radianMax)
		{
			steering_left = -radianMax;
		}
						
		var rotated_vector = rotateVectorByAngle([pole.vx,pole.vy],baseRangeAngleToRadians(steering_left));
		//console.log("BEF: "+this.vx+"-"+this.vy);
		
		pole.vx = rotated_vector[0];
		pole.vy = rotated_vector[1];
			
		pole.steering_completed += steering_left;
		
		
		
	}
	
}

function headTransform(d) {
  return "translate(" + d.path[0] + ")rotate(" + Math.atan2(d.vy, d.vx) * DEGREES + ")";
}

function tailPath(d) {
  //console.log("M868.3636145453972,585.6164949932095L866.3033006875023,590.4902686746557L864.3665792364784,595.2707767165806L863.1298571122941,600.281951640354L862.6555190851288,605.4215335681458L862.9329033449461,610.58203609198L863.7850727870652,615.7021340172895L864.7817097694576,620.8434538596657L865.1097984732862,626.1467673489026L863.578894519591,631.3319589753413L859.7237114785437,635.1875296477327L854.5872758459419,636.9220482948278");
  //return "M" + d.join("L");
  
  var path = "M"+d.join("L");
  	
  return path;
}

function poleMoveUpdate(pole)
{
			
	    var path = pole.path,
	        x = path[0][0] + pole.vx,
	        y = path[0][1] + pole.vy;
	
	
		
		poleDetectCollision(x,y,pole);
	
	
		if(pole.is_colliding_wall || pole.is_colliding_pole)
		{
			path = pole.path,
	        x = path[0][0],
	        y = path[0][1];
		}
	
		path[0][0] = x;
		path[0][1] = y;
			
	    // Bounce off the walls.
	    //bounceWalls(x,y,pole);
	
	
	
		var dx,
	        dy,
			speed;
	
		[dx,dy,speed] = unitVectors(pole.vx,pole.vy);
	
		var	count = speed * 10,
			k1 = -5 - speed / 3;	
		
	    // Swim!
	    poleSwim(x,y,dx,dy,k1,path,count,pole);
	  
	  	//Rotation
	  	
	  	poleRotate(pole);
	  	
	  
}

