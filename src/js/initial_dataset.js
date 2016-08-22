
var spermatozoa = d3.range(NUMBER_POLES).map(function() {
  var x = Math.random() * CANVAS_WIDTH,
      y = Math.random() * CANVAS_HEIGHT;
  return {
    vx: Math.random() * 2 - 1,
    vy: Math.random() * 2 - 1,
    path: d3.range(TAIL_LENGTH).map(function() { return [x, y]; }),
    count: 0
  };
});