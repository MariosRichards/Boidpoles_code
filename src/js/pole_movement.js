d3.timer(function() {
  for (var i = 0; i < spermatozoa.length; i++) {
    var spermatozoon = spermatozoa[i],
        path = spermatozoon.path,
        x = path[0][0] + spermatozoon.vx,
        y = path[0][1] + spermatozoon.vy;


	path[0][0] = x
	path[0][1] = y		
		
    // Bounce off the walls.
    bounceWalls(x,y,spermatozoon);

	var dx,
        dy,
		speed;

	[dx,dy,speed] = unitVectors(spermatozoon.vx,spermatozoon.vy);

	var	count = speed * 10,
		k1 = -5 - speed / 3;	
	
    // Swim!
    poleSwim(x,y,dx,dy,k1,path,count,spermatozoon);
  }

  head.attr("transform", headTransform);
  tail.attr("d", tailPath);
});

