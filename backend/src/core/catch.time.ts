import { Interceptor } from "../modules/interceptor/interceptor";
import { Target } from "../modules/target/target";
import { Vector3 } from "../Vector3";

export type CatchTime = {
    catchTime : number;  // seconds from now until the interceptor is at the target, the launch delay is included
    flightTime : number; // the part of catchTime that the interceptor is flying, only this part uses the battery
};

const TOLERANCE : number = 1e-3;  // meters, closer than this counts as "reached" and as "inside the circle"
const MAX_STEPS : number = 10000; // stops the search when the interceptor only just keeps up with the target

// Finds the earliest moment the interceptor can be at the same place as the target.
// Returns null if it never can:
//  - the target gets to its goal first,
//  - the catch point is outside operationalRadius (a circle around the interceptor's startPosition),
//  - or the battery runs out first (the reserve is not touched).
//
// The target flies in a straight line to its goal. Its speed right now is not stored, so we take the worst case:
// it already flies at its max speed. Of its acceleration only the part along that line counts, so a positive
// acceleration changes nothing (it is at max speed already) and a negative one slows it down.
// The interceptor waits for its launch delay, then speeds up at maxAcceleration until maxSpeed,
// and flies in a straight line to the catch point. The battery is only used while it flies.
export function calculateCatchTime(interceptor : Interceptor, target : Target, reservePercent : number) : CatchTime | null {
    const start : Vector3 = target.getPosition();
    const goalDistance : number = start.distanceTo(target.getGoal());
    if(goalDistance === 0) return null; // it is at the goal already

    const direction : Vector3 = target.getGoal().sub(start).scale(1 / goalDistance);
    const targetMaxSpeed : number = target.getMaxSpeed();
    const targetSpeed : number = targetMaxSpeed; // the worst case, see above. Change this if the target gets a speed of its own
    const targetAcceleration : number = target.getAcceleration().dot(direction);
    const timeToGoal : number = timeToFly(goalDistance, targetSpeed, targetAcceleration, targetMaxSpeed);

    const launchDelay : number = interceptor.getLaunchDelay();
    const usableSeconds : number = interceptor.getBattery().getUsableSeconds(reservePercent);
    if(usableSeconds <= 0) return null; // the battery is not above the reserve
    const lastTime : number = Math.min(timeToGoal, launchDelay + usableSeconds);

    const from : Vector3 = interceptor.getPosition();
    const home : Vector3 = interceptor.getStartPosition();
    const radius : number = interceptor.getOperationalRadius();
    const maxSpeed : number = interceptor.getMaxSpeed();
    const maxAcceleration : number = interceptor.getMaxAcceleration();

    let time : number = launchDelay;
    for(let step = 0; step < MAX_STEPS && time <= lastTime; step++){
        const flown : number = Math.min(distanceFlown(time, targetSpeed, targetAcceleration, targetMaxSpeed), goalDistance);
        const targetPoint : Vector3 = start.add(direction.scale(flown));

        const reach : number = distanceFlown(time - launchDelay, 0, maxAcceleration, maxSpeed);
        const gap : number = reach - from.distanceTo(targetPoint);   // 0 or more: the interceptor can be at the target by now
        const room : number = radius - home.distanceTo(targetPoint); // 0 or more: the target is inside the circle
        if(gap >= -TOLERANCE && room >= -TOLERANCE) return { catchTime : time, flightTime : time - launchDelay };

        // gap grows by at most maxSpeed + targetMaxSpeed per second, and room by at most targetMaxSpeed per second.
        // So it can't work before that much time has passed, and we can jump there without missing a catch.
        // A target that doesn't move and is outside the circle gives Infinity, and that ends the search.
        const waitForGap : number = gap < 0 ? -gap / (maxSpeed + targetMaxSpeed) : 0;
        const waitForRoom : number = room < 0 ? -room / targetMaxSpeed : 0;
        time += Math.max(waitForGap, waitForRoom);
    }
    return null;
}

// Meters flown in `time` seconds, starting at `speed` and changing the speed by `acceleration` every second
// (negative = slowing down). The speed stays between 0 and maxSpeed.
function distanceFlown(time : number, speed : number, acceleration : number, maxSpeed : number) : number {
    if(acceleration === 0) return speed * time;
    const limit : number = acceleration > 0 ? maxSpeed : 0; // the speed where it stops changing
    const timeToLimit : number = (limit - speed) / acceleration;
    if(time <= timeToLimit) return speed * time + 0.5 * acceleration * time * time;
    return speed * timeToLimit + 0.5 * acceleration * timeToLimit * timeToLimit + limit * (time - timeToLimit);
}

// Seconds until `distance` meters are flown, with the same movement as distanceFlown. Infinity if it never gets that far.
function timeToFly(distance : number, speed : number, acceleration : number, maxSpeed : number) : number {
    if(distance <= 0) return 0;
    if(acceleration === 0) return speed > 0 ? distance / speed : Infinity;
    const limit : number = acceleration > 0 ? maxSpeed : 0;
    const timeToLimit : number = (limit - speed) / acceleration;
    const distanceToLimit : number = speed * timeToLimit + 0.5 * acceleration * timeToLimit * timeToLimit;
    if(distance <= distanceToLimit){
        // still changing speed: this solves 0.5 * a * t^2 + speed * t = distance.
        // It is written this way so that a very small acceleration doesn't lose precision.
        return 2 * distance / (speed + Math.sqrt(Math.max(speed * speed + 2 * acceleration * distance, 0)));
    }
    return limit > 0 ? timeToLimit + (distance - distanceToLimit) / limit : Infinity; // at max speed, or stopped
}
