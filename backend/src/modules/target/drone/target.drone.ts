import {Vector3} from "../../../Vector3";
import { Target } from "../target";
import { EDanger } from "./EDanger";

// A target drone is a Target, so it can go straight into the assignment engine.
// `speed` is the max speed of the target (the engine takes the worst case, that it flies at max speed).
export class TargetDrone extends Target{
    constructor(position : Vector3, speed : number, acceleration : Vector3, goal : Vector3,
         danger : EDanger, id? : string){
        super(position, speed, acceleration, goal, danger, id);
    }

    getSpeed() : number{
        return this.getMaxSpeed();
    }

}
