import { Interceptor } from "../interceptor";
import { Vector3 } from "../../../Vector3";

// A drone is an Interceptor, so it can go straight into the assignment engine.
export class Drone extends Interceptor{

    ifMakeIt(targetPosition: Vector3, targetVelocity: Vector3, targetAcceleration: Vector3){

    }

    droneStatus(){}

}
