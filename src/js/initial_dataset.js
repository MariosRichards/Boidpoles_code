
var spermatozoa = d3.range(NUMBER_POLES).map(function() {
  var x = Math.random() * CANVAS_WIDTH,
      y = Math.random() * CANVAS_HEIGHT;
  return {
    vx: getVelocityValueX(),
    vy: getVelocityValueY(),
    path: d3.range(TAIL_LENGTH).map(function() { return [x, y]; }),
    count: 0
  };
});