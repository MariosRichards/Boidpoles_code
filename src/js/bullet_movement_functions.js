function bounceWalls(x,y,bullet)
{
	if (x < 0 || x > CANVAS_WIDTH) bullet.vx *= -1;
    if (y < 0 || y > CANVAS_HEIGHT) bullet.vy *= -1;
    
}

function bulletHeadTransform(d) {
		
  return "translate(" + d.x + "," + d.y + ")rotate(" + Math.atan2(d.vy, d.vx) * DEGREES + ")";
}

function bulletMoveUpdate(bullet)
{

    var x = bullet.x + bullet.vx,
        y = bullet.y + bullet.vy;
			
    // Bounce off the walls.
    bounceWalls(x,y,bullet);

	bulletDetectCollision(x,y,bullet);

	var dx,
        dy,
		speed;

	[dx,dy,speed] = unitVectors(bullet.vx,bullet.vy);

	var	count = speed * 10,
		k1 = -5 - speed / 3;
		
	/*x += dx  * k1;
	y += dy  * k1;
	
    bullet.x = x - dy * k2; // rotated
    bullet.y = y + dx * k2;	*/
   
    bullet.x = x;
    bullet.y = y;
		
	  	  
}

