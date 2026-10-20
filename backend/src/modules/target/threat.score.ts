import { Target } from "./target";
import { EDanger } from "./drone/EDanger";

const w1 : number  = 5;
const w2 : number = 7;
const w3 : number = 4;

// How a Target is turned into the inputs of calculateThreatScore, all on a 1 (low) to 3 (high) scale.
// Change these to tune it.
const damageSevirityByDanger : Record<EDanger, number> = {
    [EDanger.Low] : 1,
    [EDanger.Medium] : 2,
    [EDanger.High] : 3,
};
const hardestInterceptionSpeed : number = 50; // a target at this speed or faster is the hardest to intercept

export function calculateThreatScore(damageSevirity : number, assetImportancy : number,
     interceptionDifficulty : number, timeToImpact : number): number {
    return calculateUrgencyFactor(timeToImpact) * (w1 * damageSevirity + w2 * assetImportancy
         + w3 * interceptionDifficulty)
}


export function calculateTargetThreatScore(target : Target, assetImportancy : number): number {
    return calculateThreatScore(
        damageSevirityByDanger[target.getDanger()],
        assetImportancy,
        calculateInterceptionDifficulty(target.getMaxSpeed()),
        calculateTimeToImpact(target));
}

// speed 0 is the easiest (1), hardestInterceptionSpeed or faster is the hardest (3)
function calculateInterceptionDifficulty(speed : number): number {
    return 1 + 2 * Math.min(Math.max(speed / hardestInterceptionSpeed, 0), 1);
}

// time until the target reaches its goal at its max speed, Infinity if it is not moving
function calculateTimeToImpact(target : Target): number {
    const distance : number = target.getPosition().distanceTo(target.getGoal());
    if (distance === 0) return 0;
    if (target.getMaxSpeed() <= 0) return Infinity;
    return distance / target.getMaxSpeed();
}


function calculateUrgencyFactor(timeToImpact: number, decayRate: number = 0.03): number {
  if (timeToImpact <= 0) return 1.0; 
  return Math.exp(-decayRate * timeToImpact);
}