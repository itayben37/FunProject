import { Vector3 } from "../../Vector3";
import { EDanger } from "./drone/EDanger";

export class Target{
    constructor(private position : Vector3, private maxSpeed : number, private acceleration : Vector3 ,private goal : Vector3,
         private danger : EDanger, private id? : string){}

    getPosition() : Vector3{
        return this.position;
    }

    getMaxSpeed() : number{
        return this.maxSpeed;
    }

    getGoal() : Vector3{
        return this.goal;
    }

    getDanger() : EDanger{
        return this.danger;
    }

    getId() : string | undefined{
        return this.id;
    }

    getAcceleration() : Vector3{
        return this.acceleration;
    }

}