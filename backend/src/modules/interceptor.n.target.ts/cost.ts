import { Interceptor } from "../interceptor/interceptor";
import {Target} from "../target/target";
import { BadRequestError } from "../../errors/app-error";
import { calculateCatchTime, CatchTime } from "./catch.time";

// weights of the 4 parts of the cost:
// w1 = how long it takes to catch the target, w2 = the price of the interceptor,
// w3 = how much of the usable battery the flight takes, w4 = the chance that the interceptor misses (1 - Pk)
const w1 = 3, w2 =5, w3 =6, w4 = 5;
const RESERVE_PERCENT = 10; // the battery that has to be left after the flight

// hungarianAlgo only takes finite numbers, so "can't catch it" is a huge cost and not Infinity (same as in main.ts)
export const UNREACHABLE_COST : number = 1e9;
// the cost of the worst pair that still can happen (all 4 parts at 1). A target left without an interceptor should cost at least this
export const MAX_PAIR_COST : number = w1 + w2 + w3 + w4;

export type CostScale = {
    maxTime : number; // a catch that takes this many seconds or more gets the worst time score
    maxCost : number; // the price of your most expensive interceptor
};

// The cost of using interceptor i on target t, lower is better.
// Every part is between 0 (best) and 1 (worst) before its weight, so a pair that can happen costs between 0 and MAX_PAIR_COST.
// A pair that can't happen (see calculateCatchTime) costs UNREACHABLE_COST.
export function cost(i : Interceptor, t : Target, scale : CostScale) : number {
    validate(i, t, scale);

    const caught : CatchTime | null = calculateCatchTime(i, t, RESERVE_PERCENT);
    if(caught === null) return UNREACHABLE_COST;

    const timeNorm : number = clamp01(caught.catchTime / scale.maxTime);
    const costNorm : number = clamp01(i.getCost() / scale.maxCost);
    const batteryNorm : number = clamp01(caught.flightTime / i.getBattery().getUsableSeconds(RESERVE_PERCENT));
    return w1 * timeNorm + w2 * costNorm + w3 * batteryNorm + w4 * (1 - i.getPk());
}

function clamp01(x : number) : number {
    return Math.min(Math.max(x, 0), 1);
}

function validate(i : Interceptor, t : Target, scale : CostScale){
    if(!Number.isFinite(i.getMaxSpeed()) || i.getMaxSpeed() <= 0)
        throw new BadRequestError("interceptor maxSpeed must be a number > 0");
    if(!Number.isFinite(i.getMaxAcceleration()) || i.getMaxAcceleration() <= 0)
        throw new BadRequestError("interceptor maxAcceleration must be a number > 0");
    if(!Number.isFinite(i.getOperationalRadius()) || i.getOperationalRadius() < 0)
        throw new BadRequestError("interceptor operationalRadius must be a number >= 0");
    if(!Number.isFinite(i.getCost()) || i.getCost() < 0)
        throw new BadRequestError("interceptor cost must be a number >= 0");
    if(!(i.getPk() >= 0 && i.getPk() <= 1))
        throw new BadRequestError("interceptor pk must be a number between 0 and 1");
    if(!Number.isFinite(i.getLaunchDelay()) || i.getLaunchDelay() < 0)
        throw new BadRequestError("interceptor launchDelay must be a number >= 0");
    if(!Number.isFinite(t.getMaxSpeed()) || t.getMaxSpeed() < 0)
        throw new BadRequestError("target maxSpeed must be a number >= 0");
    for(const v of [i.getPosition(), i.getStartPosition(), t.getPosition(), t.getGoal(), t.getAcceleration()]){
        if(![v.getX(), v.getY(), v.getZ()].every(Number.isFinite))
            throw new BadRequestError("positions and acceleration must be {x, y, z} numbers");
    }
    if(!Number.isFinite(scale.maxTime) || scale.maxTime <= 0)
        throw new BadRequestError("maxTime must be a number > 0");
    if(!Number.isFinite(scale.maxCost) || scale.maxCost <= 0)
        throw new BadRequestError("maxCost must be a number > 0");
}
