import { TargetDroneService } from "./target.drone.service";
import {Request, Response, NextFunction} from 'express';

export class TargetDroneController{
    private static instance : TargetDroneController | undefined;

    private constructor(private readonly targetDroneService : TargetDroneService){}

    static getInstance(targetDroneService : TargetDroneService) : TargetDroneController{
        if(!TargetDroneController.instance) TargetDroneController.instance = new TargetDroneController(targetDroneService);
        return TargetDroneController.instance;
    }


    async createTargetDrone(req : Request, res : Response, next : NextFunction){
        try{
            const body = req.body ?? {};
            const targetDrone = await this.targetDroneService.createTargetDrone(body.position,
                 body.speed, body.goal, body.danger, body.acceleration);
            res.status(201).json(targetDrone);
        }catch(err){
            next(err);
        }
    }

    async getTargetDroneById(req : Request, res : Response, next : NextFunction){
        try{
            const targetDrone = await this.targetDroneService.findById(String(req.params.id));
            res.status(200).json(targetDrone);
        }catch(err){
            next(err);
        }
    }
}
