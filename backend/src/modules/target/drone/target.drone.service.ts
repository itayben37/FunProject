import { TargetDroneRepository } from "./target.drone.repository";
import { TargetDrone } from "./target.drone";
import { EDanger } from "./EDanger";
import { Vector3, Vector3Data, isVector3Data } from "../../../Vector3";
import { BadRequestError } from "../../../errors/app-error";
import {Quad} from "../../../core/quad";
import { QuadFuncs } from "../../../core/quad";
import {NotFoundError} from "../../../errors/app-error";
import { TargetProvider } from "../target.service";

export class TargetDroneService implements TargetProvider{
    private static instance : TargetDroneService | undefined;

    private constructor(private readonly targetDroneRepository : TargetDroneRepository){}

    static getInstance(targetDroneRepository : TargetDroneRepository) : TargetDroneService{
        if(!TargetDroneService.instance) TargetDroneService.instance = new TargetDroneService(targetDroneRepository);
        return TargetDroneService.instance;
    }

    // position, goal and acceleration come from the request body, so they are plain data and are checked here.
    // acceleration is optional, a target without it doesn't speed up or slow down.
    async createTargetDrone(position : Vector3Data, speed : number, goal : Vector3Data, danger : EDanger,
         acceleration? : Vector3Data) : Promise<TargetDrone>{
        if(!isVector3Data(position)) throw new BadRequestError("position must be {x, y, z} numbers");
        if(!Number.isFinite(speed) || speed < 0) throw new BadRequestError("speed must be a number >= 0");
        if(!isVector3Data(goal)) throw new BadRequestError("goal must be {x, y, z} numbers");
        if(acceleration != null && !isVector3Data(acceleration)) throw new BadRequestError("acceleration must be {x, y, z} numbers");
        if(typeof danger !== "number" || EDanger[danger] === undefined) throw new BadRequestError("danger must be 0 (Low), 1 (Medium) or 2 (High)");

        return await this.targetDroneRepository.save(new TargetDrone(
            Vector3.fromData(position),
            speed,
            acceleration ? Vector3.fromData(acceleration) : new Vector3(0, 0, 0),
            Vector3.fromData(goal),
            danger));
    }

    
    async findById(id : string)  : Promise<TargetDrone>{
        if(id == null) throw new BadRequestError("id must not be null") ;
        const domain : TargetDrone | null = await this.targetDroneRepository.findById(id);
        if (!domain) throw new NotFoundError("target drone not found");
        return domain;
    }

    async findAll() : Promise<TargetDrone[]>{
        return await this.targetDroneRepository.findAll();
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
