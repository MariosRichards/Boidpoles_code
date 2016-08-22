d3.timer(function() {
  for (var i = -1; ++i < NUMBER_POLES;) {
    var spermatozoon = spermatozoa[i],
        path = spermatozoon.path,
        dx = spermatozoon.vx,
        dy = spermatozoon.vy,
        x = path[0][0] += dx,
        y = path[0][1] += dy,
        speed = getSpeed(dx,dy),
        count = speed * 10,
        k1 = -5 - speed / 3;

    // Bounce off the walls.
    bounceWalls(x,y,spermatozoon);

    // Swim!
    poleSwim(x,y,dx,dy,k1,path,count,speed,spermatozoon);
  }

  head.attr("transform", headTransform);
  tail.attr("d", tailPath);
});

