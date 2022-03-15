export function calculateVelocity(start, end, deltaTime) {
  const delta = start - end;

  return delta / deltaTime;
}

export function createGesture(startEvent, endEvent) {
  const time = endEvent.timeStamp - startEvent.timeStamp;
  const velocityX = calculateVelocity(startEvent.touches[0].pageX, endEvent.changedTouches[0].pageX, time);
  const velocityY = calculateVelocity(startEvent.touches[0].pageY, endEvent.changedTouches[0].pageY, time);

  return {
    time,
    velocityX,
    velocityY,
  };
}
