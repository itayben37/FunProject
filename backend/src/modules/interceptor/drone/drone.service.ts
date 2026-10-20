import { DroneRepository } from "./drone.repository";
import { Drone } from "./drone.interceptor";
import { Battery } from "../battery";
import { Vector3, Vector3Data, isVector3Data } from "../../../Vector3";
import { BadRequestError } from "../../../errors/app-error";
import { InterceptorProvider } from "../interceptor.service";

export class DroneService implements InterceptorProvider{
    private static instance : DroneService | undefined;

    private constructor(private readonly droneRepository : DroneRepository, private readonly startPosition : Vector3){}

    static getInstance(droneRepository : DroneRepository, startPosition : Vector3) : DroneService{
        if(!DroneService.instance) DroneService.instance = new DroneService(droneRepository, startPosition);
        return DroneService.instance;
    }

    // position and battery come from the request body, so they are plain data and are checked here.
    // The Battery constructor checks the level and the secondsPerPercent.
    async createDrone(position : Vector3Data, maxSpeed : number, maxAcceleration : number,
         battery : { level : number, secondsPerPercent : number }, operationalRadius : number, cost : number,
         pk : number, launchDelay : number, model : string) : Promise<Drone>{
        if(!isVector3Data(position)) throw new BadRequestError("position must be {x, y, z} numbers");
        if(battery == null || typeof battery !== "object") throw new BadRequestError("battery must be {level, secondsPerPercent}");
        if(!Number.isFinite(cost) || cost < 0) throw new BadRequestError("cost must be a number >= 0");
        if(!(pk >= 0 && pk <= 1)) throw new BadRequestError("pk must be a number between 0 and 1");
        if(!Number.isFinite(launchDelay) || launchDelay < 0) throw new BadRequestError("launchDelay must be a number >= 0");
        return await this.droneRepository.save(new Drone(
            this.startPosition,
            Vector3.fromData(position),
            maxSpeed, maxAcceleration, new Battery(battery.level, battery.secondsPerPercent),
            operationalRadius, cost, pk, launchDelay, model));

    }

    async findAll() : Promise<Drone[]>{
        return await this.droneRepository.findAll();
    }

    ifInOperationalRadius(interceptorDrone : Drone, targetPosition : Vector3) : boolean{
        return this.startPosition.distanceTo(targetPosition) <=
         interceptorDrone.getOperationalRadius() ? true : false;
    }

}
