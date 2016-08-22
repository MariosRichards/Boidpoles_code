function bounceWalls(x,y,spermatozoon)
{
	if (x < 0 || x > CANVAS_WIDTH) spermatozoon.vx *= -1;
    if (y < 0 || y > CANVAS_HEIGHT) spermatozoon.vy *= -1;
    
}

function poleSwim(x,y,dx,dy,k1,path,count,speed,spermatozoon)
{
	for (var j = 0; ++j < TAIL_LENGTH;) {
      var vx = x - path[j][0],
          vy = y - path[j][1],
          k2 = Math.sin(((spermatozoon.count += count) + j * 3) / 300) / speed;
      path[j][0] = (x += dx / speed * k1) - dy * k2;
      path[j][1] = (y += dy / speed * k1) + dx * k2;
      speed = Math.sqrt((dx = vx) * dx + (dy = vy) * dy);
    }
}

function headTransform(d) {
  return "translate(" + d.path[0] + ")rotate(" + Math.atan2(d.vy, d.vx) * DEGREES + ")";
}

function tailPath(d) {
  return "M" + d.join("L");
}