import { DroneService } from "./drone.service";
import {Request, Response, NextFunction} from 'express';

export class DroneController{
    private static instance : DroneController | undefined;

    private constructor(private readonly droneService : DroneService){}

    static getInstance(droneService : DroneService) : DroneController{
        if(!DroneController.instance) DroneController.instance = new DroneController(droneService);
        return DroneController.instance;
    }


    async createDrone(req : Request, res : Response, next : NextFunction){
        try{
            const drone = await this.droneService.createDrone(req.body.position,
                 req.body.maxSpeed, req.body.maxAcceleration, req.body.battery, req.body.operationalRadius, req.body.cost, req.body.model);
            res.status(201).json(drone);
        }catch(err){
            next(err);
        }
    }

}
