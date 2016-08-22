
UNIQUE_KEY = -1;

var spermatozoa = d3.range(INITIAL_NUMBER_POLES).map(function() {
  var x = Math.random() * CANVAS_WIDTH,
      y = Math.random() * CANVAS_HEIGHT;
   
  
  UNIQUE_KEY += 1; 
      
      
  return {
    vx: getVelocityValueX(),
    vy: getVelocityValueY(),
    path: d3.range(TAIL_LENGTH).map(function() { return [x, y]; }),
    count: 0,
    key: UNIQUE_KEY,
    collision_cooldown: COLLISION_COOLDOWN
  };
  
});