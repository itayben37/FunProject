import {Vector3} from "../../../Vector3";

export class Drone{
    constructor(private startPosition : Vector3 ,private position: Vector3, private maxSpeed: number,
         private maxAcceleration: number, private battery: number, private operationalRadius
: number, private cost : number, private model : string, private id? : string){}

    ifMakeIt(targetPosition: Vector3, targetVelocity: Vector3, targetAcceleration: Vector3){

    }

    droneStatus(){}

    getStartPosition() : Vector3{
        return this.startPosition;
    }

    getPosition() : Vector3{
        return this.position;
    }

    getMaxSpeed() : number{
        return this.maxSpeed;
    }

    getMaxAcceleration() : number{
        return this.maxAcceleration;
    }

    getBattery() : number{
        return this.battery;
    }

    getOperationalRadius() : number{
        return this.operationalRadius;
    }

    getCost() : number{
        return this.cost;
    }

    getModel() : string{
        return this.model;
    }

    getId() : string | undefined{
        return this.id;
    }

}