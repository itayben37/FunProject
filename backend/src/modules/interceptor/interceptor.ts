import { Vector3 } from "../../Vector3";
import { Battery } from "./battery";

export class Interceptor{
   constructor(private startPosition : Vector3 ,private position: Vector3, private maxSpeed: number,
           private maxAcceleration: number, private battery: Battery, private operationalRadius
  : number, private cost : number, private pk : number, private launchDelay : number,
           private model : string, private id? : string){}
  
    
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

    getBattery() : Battery{
        return this.battery;
    }

    getOperationalRadius() : number{
        return this.operationalRadius;
    }

    getCost() : number{
        return this.cost;
    }

    // chance (0 to 1) that this type of interceptor hits its target
    getPk() : number{
        return this.pk;
    }

    // seconds from the assignment until it takes off
    getLaunchDelay() : number{
        return this.launchDelay;
    }

    getModel() : string{
        return this.model;
    }

    getId() : string | undefined{
        return this.id;
    }
}