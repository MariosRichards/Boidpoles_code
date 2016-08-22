function bounceWalls(x,y,spermatozoon)
{
	if (x < 0 || x > CANVAS_WIDTH) spermatozoon.vx *= -1;
    if (y < 0 || y > CANVAS_HEIGHT) spermatozoon.vy *= -1;
    
}

function poleSwim(x,y,dx,dy,k1,path,count,spermatozoon)
{
	for (var j = 1; j < path.length; j++) {
      var vx = x - path[j][0],
          vy = y - path[j][1],
          k2 = Math.sin( ( (spermatozoon.count++) * count + j * 3) / 300 ) ;
	  x += dx  * k1
	  y += dy  * k1
      path[j][0] = x - dy * k2; // rotated
      path[j][1] = y + dx * k2;
	  //dx = vx;
	  //dy = vy;
      //speed = Math.sqrt(dx * dx + dy * dy);
	  [dx, dy] = unitVectors(vx,vy);
    }
}

function headTransform(d) {
  return "translate(" + d.path[0] + ")rotate(" + Math.atan2(d.vy, d.vx) * DEGREES + ")";
}

function tailPath(d) {
  return "M" + d.join("L");
}

