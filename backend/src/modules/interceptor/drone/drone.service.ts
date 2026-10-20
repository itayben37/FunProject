import { DroneRepository } from "./drone.repository";
import { Drone } from "./drone.interceptor";
import { Vector3 } from "../../../Vector3";
import { BadRequestError } from "../../errors/app-error";

export class DroneService{
    private static instance : DroneService | undefined;

    private constructor(private readonly droneRepository : DroneRepository, private readonly startPosition : Vector3){}

    static getInstance(droneRepository : DroneRepository, startPosition : Vector3) : DroneService{
        if(!DroneService.instance) DroneService.instance = new DroneService(droneRepository, startPosition);
        return DroneService.instance;
    }

    async createDrone(position : Vector3, maxSpeed : number, maxAcceleration : number,
         battery : number, operationalRadius : number, cost : number, model : string) : Promise<Drone>{
        if(!Number.isFinite(cost) || cost < 0) throw new BadRequestError("cost must be a number >= 0");
        return await this.droneRepository.save(new Drone(
            new Vector3(this.startPosition.x, this.startPosition.y, this.startPosition.z),
            new Vector3(position.x, position.y, position.z),
            maxSpeed, maxAcceleration, battery, operationalRadius, cost, model));

    }

    ifInOperationalRadius(interceptorDrone : Drone, targetPosition : Vector3) : boolean{
        return this.startPosition.distanceTo(targetPosition) <= 
         interceptorDrone.getOperationalRadius() ? true : false;
    }

}
