import { TargetDroneRepository } from "./target.drone.repository";
import { TargetDrone } from "./target.drone";
import { EDanger } from "./EDanger";
import { Vector3 } from "../../../Vector3";
import { BadRequestError } from "../../../errors/app-error";
import {Quad} from "../../../core/quad";
import { QuadFuncs } from "../../../core/quad";
import {NotFoundError} from "../../../errors/app-error";
;
function isVector3(p : any) : p is Vector3{
    return p !== null && typeof p === "object" && [p.x, p.y, p.z].every(Number.isFinite);
}

export class TargetDroneService{
    private static instance : TargetDroneService | undefined;

    private constructor(private readonly targetDroneRepository : TargetDroneRepository){}

    static getInstance(targetDroneRepository : TargetDroneRepository) : TargetDroneService{
        if(!TargetDroneService.instance) TargetDroneService.instance = new TargetDroneService(targetDroneRepository);
        return TargetDroneService.instance;
    }

    async createTargetDrone(position : Vector3, speed : number, goal : Vector3, danger : EDanger) : Promise<TargetDrone>{
        if(!isVector3(position)) throw new BadRequestError("position must be {x, y, z} numbers");
        if(!Number.isFinite(speed) || speed < 0) throw new BadRequestError("speed must be a number >= 0");
        if(!isVector3(goal)) throw new BadRequestError("goal must be {x, y, z} numbers");
        if(typeof danger !== "number" || EDanger[danger] === undefined) throw new BadRequestError("danger must be 0 (Low), 1 (Medium) or 2 (High)");

        return await this.targetDroneRepository.save(new TargetDrone(
            new Vector3(position.x, position.y, position.z),
            speed,
            new Vector3(goal.x, goal.y, goal.z),
            danger));
    }

    
    async findById(id : string)  : Promise<TargetDrone>{
        if(id == null) throw new BadRequestError("id must not be null") ;
        const domain : TargetDrone | null = await this.targetDroneRepository.findById(id);
        if (!domain) throw new NotFoundError("target drone not found");
        return domain;
    }

    async circleToSquare(id : string, radius : number) : Promise<Quad> {
        const targetDrone : TargetDrone = await this.findById(id);
        if (!targetDrone) throw new NotFoundError("target drone not found");
        const pos : Vector3 = targetDrone.getPosition();
        return QuadFuncs.createQuad(
            pos.getX() - radius,
            pos.getY() + radius,
            radius * 2,
            radius * 2
        );
    }
    
}
