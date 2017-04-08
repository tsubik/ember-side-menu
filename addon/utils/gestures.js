export function calculateVelocity(start, end, deltaTime) {
    const delta = start - end;

    return delta / deltaTime;
}

export function createGesture(startEvent, endEvent) {
    const time = endEvent.originalEvent.timeStamp - startEvent.originalEvent.timeStamp;
    const velocityX = calculateVelocity(
        startEvent.originalEvent.touches[0].pageX,
        endEvent.originalEvent.changedTouches[0].pageX,
        time
    );
    const velocityY = calculateVelocity(
        startEvent.originalEvent.touches[0].pageY,
        endEvent.originalEvent.changedTouches[0].pageY,
        time
    );

    return {
        time,
        velocityX,
        velocityY,
    };
}
