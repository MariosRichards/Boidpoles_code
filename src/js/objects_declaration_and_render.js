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