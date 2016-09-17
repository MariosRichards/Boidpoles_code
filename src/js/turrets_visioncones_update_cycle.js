
function visionConeTransform(d)
{
	return "translate(" + d.path[0] + ")rotate(" + Math.atan2(d.vy, d.vx) * DEGREES + ")";
}

function turretTransform(d)
{
	/*d.turret_heading = radiansToBaseRangeAngle( 
		properAngleNormalisation( 
			( Math.atan2(d.vy, d.vx))-(baseRangeAngleToRadians(d.turret_heading_offset) )
			)
	);
	
	return "translate(" + d.path[0] + ")rotate(" + ((baseRangeAngleToRadians(d.turret_heading) * DEGREES)+90) + ")";*/
	
	d.turret_heading = radiansToBaseRangeAngleFloat( 
		properAngleNormalisation( 
			(properAngleNormalisation(Math.atan2(d.vy, d.vx)))+(baseRangeAngleToRadians(d.turret_heading_offset) )
			)
	);
	
	//console.log( properAngleNormalisation(Math.atan2(d.vy, d.vx)) +"<-->"+ baseRangeAngleToRadians(d.turret_heading));
	
	return "translate(" + d.path[0] + ")rotate(" + ((baseRangeAngleToRadians(d.turret_heading) * DEGREES)+90) + ")";
	
	
}

function visionConeUpdate(pole) {
		
	var detection_distance = 70;
		
	if(VISIONCONES_ACTIVE)
	{
		d3.select("#pole_vision_cone"+pole.key).attr("fill","red");
		
		for(var i=0;i<spermatozoa.length;i++)
		{
			var self_key = pole.key;
			
	
			if(spermatozoa[i].key != self_key)
			{
				var path = pole.path,
		        x = path[0][0],
		        y = path[0][1];
		
				
				//First, we detect if the enemy is within detection distance ; Same algorithm as collision detection
					
				var circle1 = {x: x, y: y};
				var circle2 = {x: spermatozoa[i].path[0][0], y: spermatozoa[i].path[0][1]};
				
				var dx = circle2.x - circle1.x;
				var dy = circle2.y - circle1.y;
				
				var distance = Math.sqrt(dx * dx + dy * dy);
				
				//If object is within detection distance, we check if it's within the appropriate angle
				if (distance <= detection_distance) {
	
				   var angle = 90 *(Math.PI/180);
				   var half_angle = angle/2;
				  			
				  
				    //console.log(pole.turret_heading);
			        //var angle_radians = Math.atan2(dy, dx) - Math.atan2(pole.vy, pole.vx);
			        
			        var angle_radians = properAngleNormalisation(properAngleNormalisation(Math.atan2(dy, dx))+baseRangeAngleToRadians(pole.turret_heading));
			        			       
					//angle_radians = Math.abs(angle_radians);
			
					//angle_radians = Math.PI - (Math.abs(Math.PI - angle_radians)%(2*Math.PI));
					 
					//if (angle_radians < 0) angle_radians += 2 * Math.PI;
						
					//if(angle_radians < half_angle && angle_radians > - half_angle)						
					if(angle_radians < half_angle || (angle_radians > 2*Math.PI - half_angle))
					{
						//console.log(angle_radians);
						d3.select("#pole_vision_cone"+pole.key).attr("fill","green");	
						
					}
					
				}
				
			}
			
		}
	}
	else {
		
		d3.select("#pole_vision_cone"+pole.key).attr("fill","none");
	}
	
	
	
}