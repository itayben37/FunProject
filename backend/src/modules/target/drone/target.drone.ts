import {Vector3} from "../../../Vector3";
import { EDanger } from "./EDanger";

export class TargetDrone{
    constructor(private position : Vector3, private speed : number, private goal : Vector3,
         private danger : EDanger, private id? : string){}

    getPosition() : Vector3{
        return this.position;
    }

    getSpeed() : number{
        return this.speed;
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

}
