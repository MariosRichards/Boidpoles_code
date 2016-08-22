

var svg = d3.select("body").append("svg")
    .attr("width", CANVAS_WIDTH)
    .attr("height", CANVAS_HEIGHT);

var g = svg.selectAll("g")
    .data(spermatozoa)
  .enter().append("g");

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

d3.timer(function() {
  for (var i = -1; ++i < NUMBER_POLES;) {
    var spermatozoon = spermatozoa[i],
        path = spermatozoon.path,
        dx = spermatozoon.vx,
        dy = spermatozoon.vy,
        x = path[0][0] += dx,
        y = path[0][1] += dy,
        speed = Math.sqrt(dx * dx + dy * dy),
        count = speed * 10,
        k1 = -5 - speed / 3;

    // Bounce off the walls.
    if (x < 0 || x > CANVAS_WIDTH) spermatozoon.vx *= -1;
    if (y < 0 || y > CANVAS_HEIGHT) spermatozoon.vy *= -1;

    // Swim!
    for (var j = 0; ++j < TAIL_LENGTH;) {
      var vx = x - path[j][0],
          vy = y - path[j][1],
          k2 = Math.sin(((spermatozoon.count += count) + j * 3) / 300) / speed;
      path[j][0] = (x += dx / speed * k1) - dy * k2;
      path[j][1] = (y += dy / speed * k1) + dx * k2;
      speed = Math.sqrt((dx = vx) * dx + (dy = vy) * dy);
    }
  }

  head.attr("transform", headTransform);
  tail.attr("d", tailPath);
});

function headTransform(d) {
  return "translate(" + d.path[0] + ")rotate(" + Math.atan2(d.vy, d.vx) * HEADSHAPE_DEGREES + ")";
}

function tailPath(d) {
  return "M" + d.join("L");
}
